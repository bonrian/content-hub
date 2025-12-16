# 🧪 Quick Test - AI Integration

## Bước 1: Thêm API Key (Khuyến nghị: Gemini - MIỄN PHÍ)

### Lấy Gemini API Key (2 phút)

1. Mở: https://makersuite.google.com/app/apikey
2. Đăng nhập Google
3. Click "Create API Key"
4. Copy key (dạng: `AIzaSy...`)

### Thêm vào .env

Mở file `backend/.env` và thêm dòng:

```env
GEMINI_API_KEY=AIzaSy-paste-key-cua-ban-vao-day
```

**Lưu file!**

---

## Bước 2: Restart Backend

### Dừng backend hiện tại:
- Nhấn `Ctrl + C` trong terminal backend (nếu đang chạy)

### Hoặc kill process:
```powershell
taskkill /F /IM node.exe
```

### Khởi động lại:
```bash
cd backend
npm run dev
```

**Chờ thấy:** `✅ MongoDB connected` và `🚀 Server running on port 5000`

---

## Bước 3: Test trong Browser

1. **Mở ứng dụng:** http://localhost:3000
2. **Đăng nhập** (nếu chưa)
3. **Click:** "Tạo ý tưởng mới"
4. **Thấy:** 2 nút AI màu tím/hồng ở đầu form:
   - 🪄 **Tạo với AI**
   - ✨ **Cải thiện**

5. **Click:** "Tạo với AI"
6. **Modal AI mở ra:**
   - Provider: Gemini được highlight (vì bạn đã add key)
   - Model: Gemini Pro
   - Temperature: 0.7

7. **Nhập chủ đề:** "Marketing cho quán cafe"
8. **Click:** "Tạo Ý Tưởng"
9. **Đợi 2-3 giây...**
10. **Kết quả hiện ra:**
    - ✅ Tiêu đề
    - ✅ Mô tả
    - ✅ Tags
11. **Click:** "✅ Áp dụng nội dung này"
12. **Form tự động điền!**
13. **Click:** "Tạo mới" để lưu

---

## Test thêm các AI khác (Optional)

### OpenAI (GPT-3.5)
```env
OPENAI_API_KEY=sk-your-key-from-platform-openai-com
```
💰 Cần credit card, ~$0.002/1K tokens

### Anthropic (Claude)
```env
ANTHROPIC_API_KEY=sk-ant-your-key-from-console-anthropic-com
```
💰 Cần credit card, ~$0.0008/1K tokens

### Deepseek
```env
DEEPSEEK_API_KEY=sk-your-key-from-platform-deepseek-com
```
💰 Rất rẻ, tốt cho technical content

---

## ✅ Checklist

- [ ] Gemini API key đã thêm vào `.env`
- [ ] Backend đã restart thành công
- [ ] Frontend đang chạy (port 3000)
- [ ] Thấy nút AI trong form
- [ ] Modal AI mở được
- [ ] Gemini được enable (màu xanh/tím)
- [ ] Test tạo ý tưởng thành công
- [ ] Kết quả áp dụng vào form được

---

## 🐛 Nếu có lỗi

### "Chưa có AI Provider nào được cấu hình"
→ Chưa thêm API key hoặc chưa restart backend

### "GEMINI_API_KEY chưa được cấu hình"
→ Kiểm tra lại file `.env`, đảm bảo không có space thừa

### "Có lỗi xảy ra khi gọi AI"
→ Kiểm tra API key có đúng không, có thể key đã hết hạn

### Không thấy nút AI
→ Frontend chưa rebuild, thử F5 (hard refresh)

---

## 🎉 Success!

Nếu test thành công, bạn đã có:
- ✅ AI tự động tạo ý tưởng
- ✅ AI cải thiện nội dung
- ✅ Retry tự động 3 lần
- ✅ Multi-provider (chọn AI tùy thích)
- ✅ Temperature control
- ✅ Beautiful UI

**Enjoy! 🚀**


