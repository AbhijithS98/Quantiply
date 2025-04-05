# Question Bot Assignment

This is a 3-part real-time chat application where a user can ask simple questions through a web UI, and the response is returned after processing through a background service. The app uses **WebSockets** for live communication and demonstrates integration between internal and external services.

## Project Structure

```bash
QUANTIPLY/
│
├── background-service/     # Background service for processing questions
│   └── index.js
│
├── express-app/            # Express.js server with WebSocket (Socket.IO)
│   └── index.js
│
├── ui-app/                 # Frontend UI built using Vite + React
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── vite.config.js
│
└── README.md               # Project documentation


```
⚙️ How It Works
1. background-service
A lightweight Node.js service that handles incoming questions.

Supported questions:

ping → responds with pong

weather → fetches weather data from wttr.in  (by default I have specified the location to Mumbai in URL)

apod → fetches NASA's Astronomy Picture of the Day from NASA API

Any other question → responds with Unknown question

2. express-app
Acts as the bridge between the frontend and background service.

Uses Socket.IO to listen to questions from the frontend.

Sends the question to the background service via HTTP.

Forwards the answer back to the frontend via WebSocket.

3. ui-app
Built using React + Vite

Simple chat interface where users can type questions and get responses.

Handles both text and image responses.

Real-time updates via WebSockets.



🚀 Getting Started

Prerequisites
* Node.js (v18+ recommended)
* npm

1. Install Dependencies
# For all 3 folders
cd background-service && npm install
cd ../express-app && npm install
cd ../ui-app && npm install


2. Start All Services Concurrently
cd ../   (come to root directory)
npm install   (to set up concurrently)
npm start 



3. Environment Variables
In the ui-app, create a .env file and add this:
VITE_EXPRESS_APP_URL=http://localhost:5000

In the express-app, create a .env file and add this:
BACKGROUND_SERVICE_URL=http://localhost:5001
PORT=5000

In the background-service, create a .env file and add this:
PORT=5001
NASA_API_KEY= (create your own API key from NASA documentation and add here)




📦 External APIs Used

🌦 Weather: https://wttr.in/?format=3
🚀 NASA APOD: https://api.nasa.gov/planetary/apod





This task was completed by Abhijith S as part of a technical assignment for Quantiply Technologies.
This project is for demo and evaluation purposes.