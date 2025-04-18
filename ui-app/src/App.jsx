import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
const EXPRESS_APP_URL = import.meta.env.VITE_EXPRESS_APP_URL;
const isProd = import.meta.env.PROD;

const socket = io(EXPRESS_APP_URL,{
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

function App() {
  
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendQuestion = () => {
    if (!question.trim()) return;
    setMessages((prev) => [...prev, { type: 'user', content: question }]);
    socket.emit('question', question);
    setQuestion('');
    setLoading(true);
  };

  useEffect(() => {
    socket.on('answer', (answer) => {
      setMessages((prev) => [...prev, { type: 'bot', content: answer }]);
      setLoading(false);
    });

    return () => socket.off('answer');
  }, []);

  return (
    <div className="container">
    <h2 className="heading">Question Bot</h2>

    <div className="chat-box">
      {messages.map((msg, index) => (
        <div key={index} className={msg.type === 'user' ? 'user-msg' : 'bot-msg'}>
          {msg.type === 'bot' && msg.content.startsWith('http') ? (
            <img src={msg.content} alt="Bot Response" className="image" />
          ) : (
            <span><strong>{msg.type === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}</span>
          )}
        </div>
      ))}

      {loading && (
        <div className='bot-msg'>
           <span><strong>Bot:</strong>typing<span className='dots'>...</span></span>
        </div>
      )}
    </div>

    <div className="input-container">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something..."
        className="input"
      />
      <button onClick={sendQuestion} className="button">Send</button>
    </div>
  </div>
  );
}

export default App;
