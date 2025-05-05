import { useState, useEffect } from 'react';
import axios from 'axios';

function Messages({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  // Fetch messages
  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:8080/api/messages/${userId}`)
      .then(response => setMessages(response.data))
      .catch(error => console.error('Error fetching messages:', error));
  }, [userId]);

  // Send message
  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;

    axios.post(`http://localhost:8080/api/messages/${userId}`, {
      message: newMessageText,
      timestamp: Date()
    })
      .then(() => {
        setNewMessageText('');
        return axios.get(`http://localhost:8080/api/messages/${userId}`);
      })
      .then(response => setMessages(response.data))
      .catch(error => console.error('Error sending message:', error));
  };

  return (
    <div>
      <h2>Messages</h2>
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index}>
              <strong>{new Date(msg.timestamp).toLocaleString()}:</strong> {msg.text}
            </div>
          ))
        ) : (
          <p>No messages found.</p>
        )}
      </div>

      <input
        type="text"
        value={newMessageText}
        onChange={(e) => setNewMessageText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Messages;
