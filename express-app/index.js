const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('redis');


dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
const REDIS_URL = process.env.REDIS_URL;

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true,
}
app.use(cors(corsOptions));


const io = new Server(server, {
  cors: corsOptions
});

// Redis clients
const redisSub = createClient({ url: REDIS_URL });
const redisPub = createClient({ url: REDIS_URL });

async function start() {

  await redisPub.connect();
  await redisSub.connect();

  await redisSub.subscribe('answers', (message) => {
    const { socketId, answer } = JSON.parse(message);
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit('answer', answer);
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('question', async (question) => {
      const message = {
        socketId: socket.id,
        question,
      };
      await redisPub.publish('questions', JSON.stringify(message));
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}


app.get('/', (req, res) => {
  res.send('Socket server is up.');
});

server.listen(PORT, () => {
  console.log(`Express app listening on http://localhost:${PORT}`);
});

// Start Redis connections and subscriptions
start().catch((err) => {
  console.error('Failed to start server:', err);
});

