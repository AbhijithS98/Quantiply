const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;
const BACKGROUND_SERVICE_URL = process.env.BACKGROUND_SERVICE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true,
}
app.use(cors(corsOptions));

const isProduction = process.env.NODE_ENV === 'production';

const io = new Server(server, {
  path: isProduction ? '/express-app/socket.io' : '/socket.io',
  cors: corsOptions
});

app.get('/', (req, res) => {
  res.send('Socket server is up.');
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('question', async (question) => {
    try {
      const response = await axios.post(`${BACKGROUND_SERVICE_URL}/ask`, { question });
      socket.emit('answer', response.data.answer);
    } catch (err) {
      socket.emit('answer', 'Error communicating with background service');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Express app listening on http://localhost:${PORT}`);
});


