const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT;
const BACKGROUND_SERVICE_URL = process.env.BACKGROUND_SERVICE_URL;

app.use(cors());
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


