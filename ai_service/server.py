from flask import Flask, request, jsonify
import json
from ai_model import ChatLogisticRegression

app = Flask(__name__)
model = ChatLogisticRegression()

with open('config.json', 'r') as f:
    config = json.load(f)


@app.route('/api/ai-chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({"error": "Không có tin nhắn"}), 400

        # Gọi hàm phân tích mới
        analysis = model.analyze(user_message)
        prob = analysis["probability"]

        # Lắp ráp lời giải thích
        explain_parts = []
        if analysis["pos_words"]:
            explain_parts.append(f"từ khen ('{', '.join(analysis['pos_words'])}')")

        # Gộp chung từ chê và cụm từ phủ định
        all_neg_terms = analysis["neg_words"] + analysis["neg_phrases"]
        if all_neg_terms:
            explain_parts.append(f"từ/cụm từ chê ('{', '.join(all_neg_terms)}')")

        if explain_parts:
            reason = "AI nhận diện được " + " và ".join(explain_parts) + "."
        else:
            reason = "AI không tìm thấy từ khóa đánh giá nào trong từ điển, dự đoán dựa trên trọng số mặc định."

        # Đánh giá Label
        threshold = config.get("threshold", 0.5)
        label = "TÍCH CỰC" if prob >= threshold else "TIÊU CỰC"

        # Gói gọn thành 1 tin nhắn có ngắt dòng (\n)
        reply_text = f"🏷️ Phân loại: {label} (Tỉ lệ: {round(prob * 100, 1)}%)\n💡 Giải thích: {reason}"

        return jsonify({"status": "success", "reply": reply_text}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(host=config['host'], port=config['port'], debug=True)