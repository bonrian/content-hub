# ⚡ Quick Start - Frontend

Hướng dẫn nhanh để chạy ứng dụng frontend.

## 🚀 3 Bước để bắt đầu

### 1. Cài đặt

```bash
cd frontend
npm install
```

### 2. Cấu hình

```bash
cp env.example .env
```

File `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Chạy

```bash
npm run dev
```

Mở `http://localhost:3000`

---

## 🎯 Sử dụng nhanh

### Đăng ký tài khoản mới
1. Truy cập `/register`
2. Nhập name, email, password
3. Tự động đăng nhập sau khi đăng ký thành công

### Đăng nhập
1. Truy cập `/login`
2. Nhập email và password
3. Redirect về dashboard

### Tạo ý tưởng đầu tiên
1. Click "Tạo ý tưởng mới"
2. Nhập title (bắt buộc)
3. Chọn category, status, priority
4. Thêm tags (optional)
5. Click "Tạo mới"

### Quản lý ý tưởng
- **Xem**: Tất cả ideas hiển thị trong dashboard
- **Sửa**: Click icon bút chì
- **Xóa**: Click icon thùng rác (có confirm)
- **Lọc**: Dropdown status/category/priority
- **Tìm kiếm**: Search bar ở top
- **Thống kê**: Toggle button "Thống kê"

---

## 📦 Project Structure

```
src/
├── components/       # UI components
├── contexts/        # Auth context
├── hooks/           # Custom hooks
├── pages/           # Pages (Login, Register, Dashboard)
├── services/        # API calls
├── types/           # TypeScript types
├── App.tsx          # Routing
└── main.tsx         # Entry
```

---

## 🎨 UI Components

### Forms
- Login form
- Register form  
- Idea form (create/edit)

### Cards
- Idea card with actions
- Stats cards

### Layout
- Dashboard with header
- Protected routes
- Modal forms

---

## 🔧 Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

---

## 🐛 Troubleshooting

**Port 3000 in use?**
```bash
# Kill process
lsof -ti:3000 | xargs kill

# Or change port in vite.config.ts
```

**API not connecting?**
- Check backend is running on port 5000
- Verify `VITE_API_URL` in `.env`
- Check CORS settings in backend

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✨ Features Overview

### ✅ Implemented
- JWT Authentication
- CRUD Ideas management  
- Filtering & Search
- Statistics dashboard
- Responsive design
- Toast notifications
- Protected routes
- TypeScript
- TailwindCSS styling

### 🎯 Demo Data
After login, you can:
1. Create multiple ideas
2. Filter by status (draft, in-progress, completed)
3. Search by keyword
4. View stats panel
5. Switch between grid/list view

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All features work on all screen sizes!

---

## 🔐 Authentication

**Flow:**
```
Register → Auto Login → Dashboard
Login → Dashboard
Protected Pages → Redirect to Login if not authenticated
```

**Token Storage:**
- localStorage: `token`, `user`
- Auto-injected in API headers
- Auto-cleared on logout/401

---

## 🎨 Customization

### Colors (tailwind.config.js)
```javascript
colors: {
  primary: { /* blue shades */ }
}
```

### Styles (index.css)
```css
.btn
.input  
.card
.badge-*
```

---

## 📚 Learn More

- [README.md](./README.md) - Full documentation
- [Backend API](../backend/README.md) - API docs
- [React Docs](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [TailwindCSS](https://tailwindcss.com)

---

**🎉 You're ready to go!**

*Built with Vite + React + TypeScript + TailwindCSS*



