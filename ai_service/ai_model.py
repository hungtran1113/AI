import math
import re


class ChatLogisticRegression:
    def __init__(self):
        self.weights = [1.5, -1.5]
        self.bias = 0.0

        self.positive_words = ['tốt', 'hay', 'tuyệt', 'đẹp', 'ok', 'thích', 'ngon']
        self.negative_words = ['tệ', 'chán', 'xấu', 'lỗi', 'hỏng', 'dở', 'chậm', 'kém']
        self.negation_phrases = ['không tốt', 'chưa tốt', 'không hay', 'chưa hay', 'không đẹp', 'không ok',
                                 'không thích', 'không ngon']

    def _sigmoid(self, z):
        z = max(min(z, 250), -250)
        return 1 / (1 + math.exp(-z))

    def analyze(self, text):
        original_text = text.lower()
        text_processing = original_text

        found_neg_phrases = []
        found_pos_words = []
        found_neg_words = []

        # 1. Tìm cụm từ phủ định (Ví dụ: "không tốt")
        for phrase in self.negation_phrases:
            if phrase in text_processing:
                found_neg_phrases.append(phrase)
                # Cắt bỏ phần đã tìm thấy để không tính nhầm chữ "tốt"
                text_processing = text_processing.replace(phrase, "")

        # 2. Tìm các từ đơn lẻ còn lại
        words = re.findall(r'\w+', text_processing)
        found_pos_words = [w for w in words if w in self.positive_words]
        found_neg_words = [w for w in words if w in self.negative_words]

        # 3. Tính toán Logistic Regression
        pos_count = len(found_pos_words)
        neg_count = len(found_neg_words) + len(found_neg_phrases)

        z = (self.weights[0] * pos_count) + (self.weights[1] * neg_count) + self.bias
        probability = self._sigmoid(z)

        # 4. Trả về toàn bộ dữ liệu để làm báo cáo
        return {
            "probability": probability,
            "pos_words": list(set(found_pos_words)),  # set() để loại bỏ từ trùng lặp
            "neg_words": list(set(found_neg_words)),
            "neg_phrases": list(set(found_neg_phrases))
        }