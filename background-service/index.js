const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const API_KEY = process.env.NASA_API_KEY;

app.use(cors());
app.use(express.json());


app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) return res.status(400).json({ answer: 'No question provided.' });

  try {
    if (question.toLowerCase() === 'ping') {
      return res.json({ answer: 'pong' });
    } else if (question.toLowerCase() === 'weather') {
      const response = await axios.get('https://wttr.in/Mumbai?format=3');
      return res.json({ answer: response.data });
    } else if (question.toLowerCase() === 'apod') {
      const response = await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
      );
      return res.json({ answer: response.data.url });
    } else {
      return res.json({ answer: 'Unknown question' });
    }
  } catch (error) {
    console.error('Error processing question:', error.message);
    res.status(500).json({ answer: 'Something went wrong!' });
  }
});

app.get('/', (req, res) => {
  res.send('background-service server is up.');
});

app.listen(PORT, () => {
  console.log(`Background service running at http://localhost:${PORT}`);
});

