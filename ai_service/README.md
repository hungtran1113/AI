

***

```markdown
# 🤖 AI Chat Sentiment Analysis Service

Đây là một Microservice độc lập chuyên xử lý và phân loại cảm xúc văn bản (Sentiment Analysis) sử dụng thuật toán **Logistic Regression tự viết (From Scratch)**. 

Service này được thiết kế theo chuẩn API RESTful, có thể kết nối với **BẤT KỲ** Backend (Node.js, Java, PHP, Python...) hay Frontend (React, Vue, Angular, Mobile App...) nào.

---

## ⚙️ 1. Cài đặt và Khởi chạy

Yêu cầu hệ thống: Có cài đặt Python 3.x.

**Bước 1:** Cài đặt thư viện bắt buộc
```bash
pip install flask
```

**Bước 2:** Khởi chạy Server AI
```bash
python server.py
```
*Mặc định, server sẽ chạy tại địa chỉ: `http://localhost:5000`*

---

## 🛠 2. Cấu hình hệ thống (config.json)

Bạn không cần sửa code Python để thay đổi cổng mạng. Mở file `config.json` để cấu hình:
- `host`: Địa chỉ IP mạng (để `0.0.0.0` nếu muốn các máy khác trong mạng LAN truy cập được).
- `port`: Cổng chạy API (Mặc định `5000`).
- `threshold`: Ngưỡng quyết định (Mặc định `0.5`). Lớn hơn hoặc bằng mức này sẽ tính là Tích cực.

---

## 📡 3. Tài liệu API (API Documentation)

Bất kỳ hệ thống nào muốn sử dụng AI đều chỉ cần gọi HTTP POST vào endpoint này.

- **URL:** `http://localhost:5000/api/ai-chat`
- **Method:** `POST`
- **Content-Type:** `application/json`

### Dữ liệu gửi lên (Request Body)
```json
{
  "message": "Sản phẩm này thiết kế rất đẹp nhưng giá thì hơi chát và giao hàng chậm"
}
```

### Dữ liệu trả về (Response Body - Thành công 200 OK)
```json
{
  "status": "success",
  "reply": "🏷️ Phân loại: TIÊU CỰC (Tỉ lệ: 18.2%)\n💡 Giải thích: AI nhận diện được từ khen ('đẹp') và từ/cụm từ chê ('chậm')."
}
```

---

## 🔗 4. Hướng dẫn kết nối từ các ngôn ngữ/Hệ thống khác

Module này không kén nền tảng. Dưới đây là các ví dụ code copy-paste để kết nối ngay lập tức:

### Cách 1: Gọi từ Node.js (Backend) dùng Axios
```javascript
const axios = require('axios');

async function askAI(userText) {
    try {
        const response = await axios.post('http://localhost:5000/api/ai-chat', {
            message: userText
        });
        console.log("AI Trả lời:", response.data.reply);
    } catch (error) {
        console.error("Lỗi gọi AI:", error.message);
    }
}
askAI("màn hình rất tuyệt");
```

### Cách 2: Gọi trực tiếp từ Frontend (React/Vanilla JS) dùng Fetch
*Lưu ý: API đã được bật sẵn CORS nên Frontend có thể gọi trực tiếp không bị chặn.*
```javascript
fetch('http://localhost:5000/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: "dùng chán quá, hay bị lỗi" })
})
.then(res => res.json())
.then(data => alert(data.reply))
.catch(err => console.log("Lỗi:", err));
```

### Cách 3: Gọi từ một Backend Python khác (dùng thư viện requests)
```python
import requests

url = "http://localhost:5000/api/ai-chat"
data = {"message": "Dịch vụ ok, ngon lành"}

response = requests.post(url, json=data)
print(response.json()["reply"])
```

### Cách 4: Test nhanh qua Terminal (cURL)
```bash
curl -X POST http://localhost:5000/api/ai-chat \
     -H "Content-Type: application/json" \
     -d '{"message": "sản phẩm tuyệt vời"}'
```
```

Vậy là hoàn tất! Với file này, bộ code Python AI của bạn đã trở thành một Microservice đóng gói hoàn chỉnh. Bất cứ ai tham gia vào project đều có thể đọc file này và tự biết cách gửi dữ liệu sang AI của bạn mà không sợ làm hỏng code gốc.