import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Your updated CSS
import logo from './assets/logo.PNG'; // adjust if needed
import DatePicker from 'react-datepicker';  // Importing the date picker
import "react-datepicker/dist/react-datepicker.css";  // Importing the styles

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [feedingRecords, setFeedingRecords] = useState([]);
  const [totalMilk, setTotalMilk] = useState(null);  // To hold the total milk for the selected date
  const [selectedDate, setSelectedDate] = useState(new Date());  // State for holding the selected date

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/searchChild?name=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
    setLoading(false);
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchFeedingRecords = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/feedingRecords/${userId}`);
      setFeedingRecords(response.data);
    } catch (error) {
      console.error('Error fetching feeding records:', error);
    }
  };

  const fetchTotalMilk = async (userId, date) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    try {
      const response = await axios.get(`http://localhost:8080/api/totalMilk/${userId}/${formattedDate}`);
      setTotalMilk(response.data);
    } catch (error) {
      console.error('Error fetching total milk:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessageText.trim()) return;
    try {
      await axios.post(`http://localhost:8080/api/messages/${selectedUserId}`, {
        senderid: "Sykepleier",
        message: newMessageText,
        timestamp: Date.now(),
        read: false,
      });
      setNewMessageText('');
      fetchMessages(selectedUserId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
      fetchFeedingRecords(selectedUserId); // Fetch feeding records too
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId && selectedDate) {
      fetchTotalMilk(selectedUserId, selectedDate); // Fetch total milk based on selected date
    }
  }, [selectedUserId, selectedDate]);

  useEffect(() => {
    const messageList = document.querySelector('.messages-list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <img src={logo} alt="Logo" />
        <h1>Dashboard</h1>
      </header>

      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Fyll inn barnets navn"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Søker...' : 'Search'}
        </button>
      </div>

      <div className="search-results">
        {searchResults.map((result) => (
          <div className="result-card" key={result.userId}>
            <h3>{result.childsName}</h3>
            <p>E-post: {result.email}</p>
            <p>Forelder/Foresatts navn: {result.parentName}</p>
            <p>Barns fødtselsdag: {result.childDateOfBirth}</p>
            <button onClick={() => setSelectedUserId(result.userId)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedUserId && (
        <div className="dashboard-sections">
          {/* Messages Section */}
          <div className="section-card messages-card">
            <h2>Meldinger</h2>
            <div className="messages-list">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div className="message" key={index}>
                    <strong>{new Date(msg.timestamp).toLocaleString()}:</strong> {msg.message}
                  </div>
                ))
              ) : (
                <p>Ingen meldinger</p>
              )}
            </div>

            <div className="send-message-container">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>

          {/* Feeding Records Section */}
          <div className="section-card feeding-records-card">
            <h2>Feeding Records</h2>
            {feedingRecords.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Dato</th>
                    <th>Mengde (ml)</th>
                  </tr>
                </thead>
                <tbody>
                  {feedingRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{record.amount} ml</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No feeding records found.</p>
            )}
          </div>

          {/* Total Milk Section */}
          <div className="section-card total-milk-card">
            <h2>Melke Total fra {selectedDate.toLocaleDateString()}</h2>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="date-picker"
            />
            <p>{totalMilk ? `Melke Total: ${totalMilk}` : 'Loading total milk...'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
