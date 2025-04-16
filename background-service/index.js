const axios = require('axios');
const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.NASA_API_KEY;
const REDIS_URL = process.env.REDIS_URL;


// Redis clients
const redisSub = createClient({ url: REDIS_URL });
const redisPub = createClient({ url: REDIS_URL });


// Subscribe to incoming questions
async function start() {
  await redisPub.connect();
  await redisSub.connect();

  await redisSub.subscribe('questions', async (message) => {
    const { socketId, question } = JSON.parse(message);

    let answer = 'Unknown question';

    try {
      if (!question) {
        answer = 'No question provided.';
      } else if (question.toLowerCase() === 'ping') {
        answer = 'pong';
      } else if (question.toLowerCase() === 'weather') {
        const response = await axios.get('https://wttr.in/Mumbai?format=3');
        answer = response.data;
      } else if (question.toLowerCase() === 'apod') {
        const response = await axios.get(
          `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
        );
        answer = response.data.url;
      }
    } catch (error) {
      console.error('Error processing question:', error.message);
      answer = 'Something went wrong!';
    }

    await redisPub.publish('answers', JSON.stringify({ socketId, answer }));
  });

  console.log('Background service listening for Redis messages...');
}

start();