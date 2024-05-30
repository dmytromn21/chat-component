import React, { useState } from 'react';
import axios from 'axios';
import './ChatComponent.css';

const ChatComponent = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [imageNumber, setImageNumber] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello, How can I assistant you today?' }
  ])

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      setQuestion("");
      setMessages((messages) => [...messages, { role: 'user', content: question }]);
      const res = await axios.post('https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: 'user', content: question }],
          max_tokens: 800,
          temperature: 0.0
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPEN_API_KEY}`,
          },
          timeout: 30000 // Increase timeout to 30 seconds
        });
      setMessages((messages) => [...messages, { role: 'assistant', content: res.data.choices[0].message.content.trim() }])
      // setResponse(res.data.response_text);
      // setImageNumber(res.data.image_number);
      // setLogs(res.data.logs);
    } catch (error) {
      console.error("Error fetching data: ", error);
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        setError("No response received from server.");
      } else {
        setError(`Error: ${error.message}`);
      }
    }
  };

  const handleKeyPress = (event) => {
    if(question == "") {
      return;
    }
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className='chat-container'>
      <div>
        <div className='header-img-container'>
          <img src='chat-header.png' />
        </div>
        <div className='header-title-container'>
          <div className='header-title-1'>Chat with customer service 24/7:</div>
          <div className='header-title-2'>We reply immediately.</div>
        </div>
      </div>
      <div className='chat-box-container'>
        <div className='messages-container'>
          {messages.map((message) => (
            <ChatMessage message={message} />
          ))}
        </div>
        <div className='message-input'>
          <input
            type="text"
            value={question}
            onChange={handleInputChange}
            placeholder="Enter your message:"
            onKeyDown={handleKeyPress}
          />
        </div>
        {/* {error && <p style={{ color: 'red' }}>{error}</p>}
        {response && (
          <div>
            <p>Response: {response}</p>
            {imageNumber && <p>Image Number: {imageNumber}</p>}
          </div>
        )}
        {logs.length > 0 && (
          <div>
            <h3>Chat Logs:</h3>
            <ul>
              {logs.map((log, index) => (
                <li key={index}>
                  <p>Timestamp: {log.timestamp}</p>
                  <p>User IP: {log.user_ip}</p>
                  <p>Question: {log.question}</p>
                  <p>Response: {log.response_text}</p>
                  <p>Image Number: {log.image_number}</p>
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
};

const ChatMessage = ({ message }) => {
  return (
    <div className={`message-container ${message.role === "assistant" ? "assistant-message-container" : "user-message-container"}`}>
      <div className="message">
        <div>
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
