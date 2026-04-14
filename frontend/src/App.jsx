import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      // Gọi sang Node.js Backend ở port 3000
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      console.error("Chi tiết lỗi kết nối:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Lỗi kết nối máy chủ.' }]);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'Arial' }}>
      <h3 style={{ textAlign: 'center' }}>Chat với AI (Sinh viên Project)</h3>

      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '10px 0' }}>
            <span style={{ 
              background: msg.sender === 'user' ? '#0084ff' : '#f0f0f0', 
              color: msg.sender === 'user' ? '#fff' : '#000',
              padding: '10px 15px', 
              borderRadius: '20px',
              display: 'inline-block',
              maxWidth: '80%',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập: sản phẩm này rất tốt..."
          style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleSend} 
          style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '20px', border: 'none', background: '#0084ff', color: 'white', cursor: 'pointer' }}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

export default App;