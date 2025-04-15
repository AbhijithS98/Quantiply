const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('redis');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;
// const BACKGROUND_SERVICE_URL = process.env.BACKGROUND_SERVICE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true,
}
app.use(cors(corsOptions));

// const isProduction = process.env.NODE_ENV === 'production';

const io = new Server(server, {
  cors: corsOptions
});

// Redis clients
const redisPub = createClient();
const redisSub = createClient();

redisPub.connect();
redisSub.connect();

app.get('/', (req, res) => {
  res.send('Socket server is up.');
});


redisSub.subscribe('answers', (message) => {
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

server.listen(PORT, () => {
  console.log(`Express app listening on http://localhost:${PORT}`);
});


