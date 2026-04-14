



## 🚀 Hướng dẫn cài đặt sau khi Clone từ GitHub



Sau khi tải dự án về máy (`git clone`), bạn cần cài đặt các thư viện phụ thuộc cho cả 3 phần (AI, Backend, Frontend) trước khi chạy. Hãy mở Terminal và thực hiện lần lượt các bước sau:

**1. Khởi động AI Service (Python)**
```bash
cd ai_service
pip install flask
python server.py
```

**2. Khởi động Backend (Node.js)**
Mở một Terminal mới:
```bash
cd backend
npm install
node server.js
```

**3. Khởi động Frontend (React/Vite)**
Mở một Terminal mới:
```bash
cd frontend
npm install
npm run dev
```

## Tóm tắt quy trình chạy:

- **B1:** `Bật PyCharm chạy AI (python server.py)`

- **B2:** `Bật VS Code 1 chạy Backend (node server.js)`

- **B3:** `Bật VS Code 2 chạy Frontend (npm run dev)`
