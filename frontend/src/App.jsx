import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  // Khởi tạo tin nhắn chào mừng mặc định
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "Chào bạn! Tôi là AI phân tích cảm xúc (Sử dụng mô hình Logistic Regression tự viết). Hãy thử nhắn tin gì đó (ví dụ: 'tuyệt quá' hoặc 'thất vọng quá'), tôi sẽ phân tích giúp bạn!" 
    }
  ]);
  const [input, setInput] = useState('');
  
  // Trạng thái AI đang gõ chữ
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref để tự động cuộn xuống cuối cùng khi có tin nhắn mới
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // Cuộn mỗi khi có tin nhắn hoặc khi bot bắt đầu gõ

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    // 1. Hiển thị tin nhắn người dùng
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    
    // 2. Bật hiệu ứng AI đang gõ
    setIsTyping(true);

    try {
      // (Tùy chọn) Thêm một độ trễ ảo 1 giây để tạo cảm giác AI đang "suy nghĩ" thật
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Gọi API đến Backend Node.js
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      const data = await response.json();
      
      // 3. Tắt hiệu ứng gõ và hiển thị kết quả
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      
    } catch (error) {
      console.error("Chi tiết lỗi kết nối:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Lỗi kết nối máy chủ. Hãy kiểm tra Backend và AI Service.' }]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Cài đặt CSS cho hiệu ứng 3 dấu chấm nhảy */}
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-6px); }
          }
          .typing-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: #888;
            border-radius: 50%;
            margin: 0 3px;
            animation: bounce 1.4s infinite ease-in-out both;
          }
          .typing-dot:nth-child(1) { animation-delay: -0.32s; }
          .typing-dot:nth-child(2) { animation-delay: -0.16s; }
          
          /* Tùy chỉnh thanh cuộn cho đẹp */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        `}
      </style>

      {/* Header */}
      <div style={{ backgroundColor: '#5b4df2', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Icon Robot */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>AI Sentiment Analyst</h2>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>CUSTOM LOGISTIC REGRESSION</p>
          </div>
        </div>
        <div style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '5px 15px', borderRadius: '20px', fontSize: '12px' }}>
          Module: AI Manual Engine v1.0
        </div>
      </div>

      {/* Khu vực Chat */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: '10px' }}>
            
            {/* Avatar Bot (Chỉ hiện nếu là bot) */}
            {msg.sender === 'bot' && (
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b4df2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
              </div>
            )}

            {/* Khung tin nhắn */}
            <div style={{ 
              backgroundColor: msg.sender === 'user' ? '#5b4df2' : 'white', 
              color: msg.sender === 'user' ? 'white' : '#333',
              padding: '12px 18px', 
              borderRadius: '20px',
              borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '20px',
              borderTopRightRadius: msg.sender === 'user' ? '4px' : '20px',
              maxWidth: '70%',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              fontSize: '15px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap' // Giữ nguyên ngắt dòng của Explainable AI
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Hiệu ứng AI đang gõ */}
        {isTyping && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', flexShrink: 0 }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b4df2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
            </div>
            <div style={{ backgroundColor: 'white', padding: '15px 18px', borderRadius: '20px', borderTopLeftRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        
        {/* Điểm neo để tự động cuộn */}
        <div ref={messagesEndRef} />
      </div>

      {/* Khu vực Input */}
      <div style={{ backgroundColor: 'white', padding: '20px 30px', borderTop: '1px solid #eaeaea', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', width: '100%', maxWidth: '800px', gap: '15px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập nội dung cần phân tích (VD: Rất vui khi được giúp đỡ)..."
            style={{ 
              flex: 1, 
              padding: '15px 20px', 
              borderRadius: '25px', 
              border: '1px solid #ddd', 
              outline: 'none',
              fontSize: '15px',
              backgroundColor: '#f9fafb'
            }}
          />
          <button 
            onClick={handleSend} 
            disabled={isTyping}
            style={{ 
              backgroundColor: isTyping ? '#a5b4fc' : '#9ca3af', 
              color: 'white', 
              border: 'none', 
              borderRadius: '25px', 
              padding: '0 25px', 
              cursor: isTyping ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;