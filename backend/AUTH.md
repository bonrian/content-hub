# 🔐 Authentication Guide

Hướng dẫn chi tiết về JWT Authentication trong Content Ideas Manager API.

## 📋 Tổng quan

API sử dụng JWT (JSON Web Token) để authentication và authorization:
- ✅ Đăng ký và đăng nhập user
- ✅ JWT token với thời hạn 7 ngày (configurable)
- ✅ Password được hash bằng bcrypt
- ✅ Protected routes yêu cầu token hợp lệ
- ✅ Mỗi idea gắn với user tạo ra nó
- ✅ User chỉ có thể xem/sửa/xóa ideas của mình

---

## 🚀 Authentication Endpoints

### 1. POST /api/auth/register - Đăng ký

**Request Body:**
```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation:**
- `name`: Bắt buộc, max 50 ký tự
- `email`: Bắt buộc, phải là email hợp lệ, unique
- `password`: Bắt buộc, min 6 ký tự

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400`: Thiếu thông tin hoặc email đã tồn tại
- `400`: Password quá ngắn (< 6 ký tự)

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

### 2. POST /api/auth/login - Đăng nhập

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400`: Thiếu email hoặc password
- `401`: Email hoặc password không đúng

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

### 3. GET /api/auth/me - Lấy thông tin user hiện tại

**Headers Required:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. PUT /api/auth/updateprofile - Cập nhật thông tin

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Nguyen Van B",
  "email": "newmail@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Nguyen Van B",
    "email": "newmail@example.com",
    "role": "user"
  }
}
```

---

### 5. PUT /api/auth/updatepassword - Đổi password

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Đổi password thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Thiếu thông tin
- `400`: Password mới quá ngắn
- `401`: Password hiện tại không đúng

---

## 🔒 Protected Routes

Tất cả `/api/ideas` endpoints đều yêu cầu authentication:

### Cách sử dụng token:

**Header:**
```
Authorization: Bearer <your-jwt-token>
```

**Example với cURL:**
```bash
# Lấy token từ login
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Sử dụng token trong requests
curl http://localhost:5000/api/ideas \
  -H "Authorization: Bearer $TOKEN"

# Tạo idea mới
curl -X POST http://localhost:5000/api/ideas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Private Idea",
    "category": "blog"
  }'
```

---

## 🛡️ User Ownership & Permissions

### Ownership Rules:

1. **Create**: Idea tự động gắn với user tạo ra nó
   - Field `user` được tự động set = `req.user.id`

2. **Read**: User chỉ xem được ideas của mình
   - `GET /api/ideas` - Chỉ trả về ideas của user
   - `GET /api/ideas/:id` - Kiểm tra ownership

3. **Update**: Chỉ owner mới update được
   - Status 403 nếu không phải owner

4. **Delete**: Chỉ owner mới xóa được
   - Status 403 nếu không phải owner

5. **Stats**: Chỉ thống kê ideas của user
   - Tự động filter theo `user.id`

### Ownership Check Example:

```javascript
// Trong controller
if (idea.user.toString() !== req.user.id) {
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập'
  });
}
```

---

## 🔑 JWT Token Details

### Token Structure:

**Payload:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "iat": 1642245600,
  "exp": 1642850400
}
```

### Token Lifetime:
- Default: **7 days**
- Configurable via `JWT_EXPIRE` in `.env`
- Options: `7d`, `30d`, `24h`, `60m`

### Token Generation:
```javascript
// Trong User model
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};
```

---

## 🧪 Testing Authentication Flow

### Full Workflow Test:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

# 1. Đăng ký user mới
echo "1️⃣ Đăng ký..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

echo $REGISTER_RESPONSE | json_pp

# Lấy token
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

# 2. Kiểm tra thông tin user
echo -e "\n2️⃣ Lấy thông tin user..."
curl -s "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | json_pp

# 3. Tạo idea với token
echo -e "\n3️⃣ Tạo idea..."
IDEA_RESPONSE=$(curl -s -X POST "$BASE_URL/ideas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Protected Idea",
    "description": "This idea belongs to authenticated user",
    "category": "blog",
    "priority": "high"
  }')

echo $IDEA_RESPONSE | json_pp
IDEA_ID=$(echo $IDEA_RESPONSE | jq -r '.data._id')

# 4. Lấy danh sách ideas (chỉ của user này)
echo -e "\n4️⃣ Lấy danh sách ideas..."
curl -s "$BASE_URL/ideas" \
  -H "Authorization: Bearer $TOKEN" | json_pp

# 5. Test without token (should fail)
echo -e "\n5️⃣ Test không có token (should fail)..."
curl -s "$BASE_URL/ideas"

echo -e "\n✅ Tests completed!"
```

---

## 🔐 Security Best Practices

### 1. JWT Secret
```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to .env
JWT_SECRET=your-generated-secret-here
```

### 2. Password Security
- ✅ Passwords are hashed with bcrypt (10 salt rounds)
- ✅ Passwords never returned in responses
- ✅ Minimum 6 characters required
- ✅ Use `select: false` in User schema

### 3. Token Security
- ✅ Token transmitted via HTTP header (not URL)
- ✅ Token expires after 7 days
- ✅ HTTPS recommended in production
- ✅ Token verified on every protected request

### 4. Error Messages
- ✅ Generic messages for auth failures
- ✅ Don't reveal if email exists
- ✅ Same error for wrong email/password

---

## ⚠️ Error Handling

### Common Error Responses:

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Không có quyền truy cập, vui lòng đăng nhập"
}
```

**401 Invalid Token:**
```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập"
}
```

**400 Validation Error:**
```json
{
  "success": false,
  "message": "Password phải có ít nhất 6 ký tự"
}
```

---

## 📱 Frontend Integration

### React Example:

```javascript
// auth.service.js
const API_URL = 'http://localhost:5000/api/auth';

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  
  return data;
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  
  return data;
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ideas.service.js
export const getIdeas = async () => {
  const response = await fetch('http://localhost:5000/api/ideas', {
    headers: {
      ...getAuthHeader()
    }
  });
  return await response.json();
};

export const createIdea = async (ideaData) => {
  const response = await fetch('http://localhost:5000/api/ideas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(ideaData)
  });
  return await response.json();
};
```

---

## 🎯 Migration Guide

### Nếu đã có ideas cũ (không có user):

Ideas cũ sẽ không có field `user`, cần migrate:

```javascript
// migration-script.js
const mongoose = require('mongoose');
const Idea = require('./src/models/Idea');
const User = require('./src/models/User');

async function migrateIdeas() {
  // Tìm một admin user hoặc tạo system user
  const systemUser = await User.findOne({ email: 'admin@example.com' });
  
  if (!systemUser) {
    console.log('Vui lòng tạo admin user trước');
    return;
  }
  
  // Update tất cả ideas không có user
  await Idea.updateMany(
    { user: { $exists: false } },
    { $set: { user: systemUser._id } }
  );
  
  console.log('Migration completed!');
}
```

---

**🔐 Your API is now secured with JWT Authentication!**



