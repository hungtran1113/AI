const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Gọi sang Python AI ở port 5000
        const aiResponse = await axios.post('http://localhost:5000/api/ai-chat', {
            message: userMessage
        });
        res.json({ reply: aiResponse.data.reply });

    } catch (error) {
        console.error("Lỗi:", error.message);
        res.status(500).json({ reply: "Lỗi: Không thể kết nối AI." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Node.js Backend chạy tại http://localhost:${PORT}`);
});