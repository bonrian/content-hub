# 🚀 Quick Start Guide - JWT Authentication

Hướng dẫn nhanh để bắt đầu với Content Ideas API có JWT Authentication.

## ⚡ 5 Bước để bắt đầu

### 1. Cài đặt và Setup

```bash
cd backend
npm install
cp env.example .env
```

### 2. Cấu hình .env

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/content-ideas
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Khởi động MongoDB

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### 4. Chạy Server

```bash
npm run dev
```

Server chạy tại: `http://localhost:5000`

### 5. Test Authentication

```bash
# Đăng ký
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'

# Đăng nhập và lấy token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Sử dụng token để tạo idea
curl -X POST http://localhost:5000/api/ideas \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Idea","category":"blog"}'
```

---

## 📋 API Endpoints Cheat Sheet

### Authentication (Public)

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/register` | `{name, email, password}` |
| POST | `/api/auth/login` | `{email, password}` |

### User Management (Protected)

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/auth/me` | - |
| PUT | `/api/auth/updateprofile` | `{name?, email?}` |
| PUT | `/api/auth/updatepassword` | `{currentPassword, newPassword}` |

### Ideas Management (Protected)

| Method | Endpoint | Query/Body |
|--------|----------|------------|
| GET | `/api/ideas` | `?page=1&limit=10&status=draft&category=blog&priority=high&search=keyword` |
| GET | `/api/ideas/:id` | - |
| POST | `/api/ideas` | `{title, description?, category?, status?, priority?, tags?}` |
| PUT | `/api/ideas/:id` | `{title?, description?, category?, status?, priority?, tags?}` |
| DELETE | `/api/ideas/:id` | - |
| GET | `/api/ideas/stats` | - |

---

## 🔑 Authentication Flow

```
1. User Registers → Receives JWT Token
   POST /api/auth/register
   
2. User Logs In → Receives JWT Token
   POST /api/auth/login
   
3. Use Token in Header for Protected Routes
   Authorization: Bearer <token>
   
4. Token Valid for 7 Days (configurable)
   After expiry, login again
```

---

## 📦 Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Login/Register Response

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

---

## 🛡️ Security Features

✅ **Password Hashing** - bcrypt với 10 salt rounds
✅ **JWT Tokens** - Signed với secret, expires in 7 days
✅ **Protected Routes** - Middleware kiểm tra token
✅ **User Ownership** - User chỉ CRUD ideas của mình
✅ **Validation** - Input validation ở mọi endpoint
✅ **Error Handling** - Thông báo lỗi rõ ràng

---

## 🧪 Testing Script

Tạo file `test.sh`:

```bash
#!/bin/bash

BASE="http://localhost:5000/api"

echo "🧪 Testing Authentication Flow..."

# Register
echo "1️⃣ Register user..."
REGISTER=$(curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}')

TOKEN=$(echo $REGISTER | jq -r '.token')
echo "Token: $TOKEN"

# Get user info
echo -e "\n2️⃣ Get user info..."
curl -s "$BASE/auth/me" -H "Authorization: Bearer $TOKEN" | jq

# Create idea
echo -e "\n3️⃣ Create idea..."
IDEA=$(curl -s -X POST "$BASE/ideas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Idea","category":"blog","priority":"high"}')

echo $IDEA | jq
IDEA_ID=$(echo $IDEA | jq -r '.data._id')

# Get ideas
echo -e "\n4️⃣ Get all ideas..."
curl -s "$BASE/ideas" -H "Authorization: Bearer $TOKEN" | jq

# Update idea
echo -e "\n5️⃣ Update idea..."
curl -s -X PUT "$BASE/ideas/$IDEA_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}' | jq

# Get stats
echo -e "\n6️⃣ Get stats..."
curl -s "$BASE/ideas/stats" -H "Authorization: Bearer $TOKEN" | jq

# Delete idea
echo -e "\n7️⃣ Delete idea..."
curl -s -X DELETE "$BASE/ideas/$IDEA_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\n✅ All tests completed!"
```

Chạy test:
```bash
chmod +x test.sh
./test.sh
```

---

## 🔧 Common Issues

### "Token không hợp lệ"
- Đăng nhập lại để lấy token mới
- Kiểm tra JWT_SECRET trong .env

### "Bạn không có quyền truy cập"
- Bạn đang cố access idea của user khác
- Mỗi user chỉ có thể CRUD ideas của mình

### "MongoDB connection error"
- Đảm bảo MongoDB đang chạy
- Kiểm tra MONGODB_URI trong .env

---

## 📚 Full Documentation

- **README.md** - Tổng quan và setup chi tiết
- **AUTH.md** - Chi tiết về authentication
- **API-TESTING.md** - Test cases đầy đủ

---

## 🎯 Next Steps

1. ✅ Test tất cả endpoints với Postman
2. ✅ Tạo frontend React/Vue
3. ✅ Deploy lên Heroku/Railway
4. ✅ Thêm role-based permissions
5. ✅ Implement refresh tokens
6. ✅ Add email verification

---

**🚀 You're ready to build amazing things!**



