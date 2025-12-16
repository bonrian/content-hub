# 🚀 Content Ideas Manager - Backend API

REST API backend cho ứng dụng quản lý ý tưởng nội dung, xây dựng bằng Node.js, Express.js và MongoDB.

## 📋 Tính năng

- ✅ **JWT Authentication** - Đăng ký, đăng nhập, bảo mật
- ✅ **User Management** - Quản lý thông tin user, đổi password
- ✅ **CRUD operations** đầy đủ cho quản lý ý tưởng
- ✅ **User Ownership** - Mỗi idea gắn với user tạo ra nó
- ✅ **Protected Routes** - Chỉ owner mới xem/sửa/xóa ideas
- ✅ **Pagination, filtering và search**
- ✅ **Thống kê** theo status, category, priority
- ✅ **Validation** dữ liệu toàn diện
- ✅ **Error handling** chuyên nghiệp
- ✅ **CORS configuration**
- ✅ **RESTful API design**

## 🛠️ Công nghệ sử dụng

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables management
- **cors** - Cross-Origin Resource Sharing

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Cấu hình kết nối MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── ideaController.js    # Ideas CRUD logic
│   ├── models/
│   │   ├── User.js              # User model với password hashing
│   │   └── Idea.js              # Idea model với user reference
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── ideaRoutes.js        # Ideas endpoints (protected)
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── errorHandler.js      # Error handling middleware
│   └── server.js                # Entry point
├── .gitignore
├── env.example                   # Environment variables template
├── package.json
├── README.md                     # Main documentation
├── AUTH.md                       # Authentication guide
└── API-TESTING.md                # API testing guide
```

## 🚀 Cài đặt và chạy

### 1. Clone repository và cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `env.example`:

```bash
cp env.example .env
```

Cập nhật file `.env` với thông tin của bạn:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/content-ideas
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**⚠️ Important:** Thay đổi `JWT_SECRET` thành một chuỗi ngẫu nhiên mạnh trong production!

### 3. Đảm bảo MongoDB đang chạy

**Cách 1: MongoDB local**
```bash
# Trên Windows
net start MongoDB

# Trên Mac/Linux
sudo systemctl start mongod
```

**Cách 2: MongoDB Atlas (Cloud)**
- Đăng ký tài khoản miễn phí tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Tạo cluster và lấy connection string
- Cập nhật `MONGODB_URI` trong file `.env`

### 4. Chạy server

**Development mode (với nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 🔐 Authentication

API sử dụng JWT (JSON Web Token) để authentication. Xem chi tiết trong [AUTH.md](./AUTH.md)

### Quick Start với Authentication:

**1. Đăng ký:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your@email.com",
    "password": "password123"
  }'
```

**2. Đăng nhập (lấy token):**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "password123"
  }'
```

**3. Sử dụng token trong requests:**
```bash
# Lưu token vào biến
TOKEN="your-jwt-token-here"

# Gọi API với token
curl http://localhost:5000/api/ideas \
  -H "Authorization: Bearer $TOKEN"
```

### Authentication Endpoints:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Đăng ký user mới | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/auth/me` | Lấy thông tin user | ✅ |
| PUT | `/api/auth/updateprofile` | Cập nhật thông tin | ✅ |
| PUT | `/api/auth/updatepassword` | Đổi password | ✅ |

**📚 Chi tiết:** Xem [AUTH.md](./AUTH.md) để biết thêm về authentication flow, security và examples.

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

**⚠️ Tất cả `/api/ideas` endpoints đều yêu cầu authentication!**

### 1. Lấy tất cả ý tưởng của user
```http
GET /ideas
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Số trang (default: 1)
- `limit` (number): Số items mỗi trang (default: 10)
- `status` (string): Filter theo status (draft | in-progress | completed | archived)
- `category` (string): Filter theo category (blog | video | social-media | podcast | newsletter | other)
- `priority` (string): Filter theo priority (low | medium | high)
- `search` (string): Tìm kiếm theo title hoặc description

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "totalPages": 3,
  "currentPage": 1,
  "data": [
    {
      "_id": "...",
      "title": "...",
      "user": {
        "_id": "...",
        "name": "Your Name",
        "email": "your@email.com"
      },
      ...
    }
  ]
}
```

### 2. Lấy một ý tưởng theo ID
```http
GET /ideas/:id
Authorization: Bearer <token>
```

**Note:** Chỉ có thể xem idea của chính mình.

### 3. Tạo ý tưởng mới
```http
POST /ideas
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Viết bài về AI",
  "description": "Bài viết giới thiệu về trí tuệ nhân tạo",
  "category": "blog",
  "status": "draft",
  "priority": "high",
  "tags": ["AI", "Technology", "Blog"]
}
```

**Note:** `user` field sẽ tự động được gán bằng user ID của bạn.

### 4. Cập nhật ý tưởng
```http
PUT /ideas/:id
Authorization: Bearer <token>
```

**Body:** (tương tự POST)

**Note:** Chỉ có thể update idea của chính mình.

### 5. Xóa ý tưởng
```http
DELETE /ideas/:id
Authorization: Bearer <token>
```

**Note:** Chỉ có thể xóa idea của chính mình.

### 6. Lấy thống kê của user
```http
GET /ideas/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "byStatus": [
      { "_id": "draft", "count": 10 },
      { "_id": "in-progress", "count": 8 },
      { "_id": "completed", "count": 7 }
    ],
    "byCategory": [...],
    "byPriority": [...]
  }
}
```

**Note:** Chỉ thống kê ideas của chính user.

## 📊 Data Model

### User Schema

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| name | String | Yes | No | Tên người dùng (max 50 chars) |
| email | String | Yes | Yes | Email (lowercase, validated) |
| password | String | Yes | No | Password hash (min 6 chars, not returned) |
| role | String | No | No | user, admin (default: user) |
| createdAt | Date | Auto | - | Thời gian tạo |
| updatedAt | Date | Auto | - | Thời gian cập nhật |

### Idea Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | String | Yes | - | Tiêu đề ý tưởng (max 200 chars) |
| description | String | No | - | Mô tả chi tiết (max 2000 chars) |
| category | String | No | 'other' | blog, video, social-media, podcast, newsletter, other |
| status | String | No | 'draft' | draft, in-progress, completed, archived |
| priority | String | No | 'medium' | low, medium, high |
| tags | Array | No | [] | Mảng các tag |
| user | ObjectId | Yes | - | Reference đến User (owner) |
| createdAt | Date | Auto | - | Thời gian tạo |
| updatedAt | Date | Auto | - | Thời gian cập nhật |

## 🧪 Test API với cURL

### Complete Authentication Flow:

```bash
# 1. Đăng ký user mới
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# 2. Đăng nhập (save token)
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.token')

echo "Token: $TOKEN"

# 3. Tạo ý tưởng với token
curl -X POST http://localhost:5000/api/ideas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Idea",
    "description": "This is my idea",
    "category": "blog",
    "priority": "high"
  }'

# 4. Lấy danh sách ý tưởng
curl http://localhost:5000/api/ideas \
  -H "Authorization: Bearer $TOKEN"

# 5. Lấy ý tưởng với filter
curl "http://localhost:5000/api/ideas?status=draft&priority=high" \
  -H "Authorization: Bearer $TOKEN"

# 6. Lấy thống kê
curl http://localhost:5000/api/ideas/stats \
  -H "Authorization: Bearer $TOKEN"
```

**📚 More Examples:** Xem [API-TESTING.md](./API-TESTING.md) và [AUTH.md](./AUTH.md) để biết thêm test cases.

## 🔧 Development

### Cài đặt dependencies cho development
```bash
npm install --save-dev nodemon
```

### Các scripts có sẵn
- `npm start` - Chạy server production
- `npm run dev` - Chạy server development với nodemon

## 📝 Lưu ý

1. **JWT Secret**: Thay đổi `JWT_SECRET` trong production bằng chuỗi ngẫu nhiên mạnh
2. **Authentication**: Tất cả `/api/ideas` endpoints đều yêu cầu JWT token
3. **User Ownership**: Mỗi user chỉ có thể CRUD ideas của chính mình
4. **MongoDB Connection**: Đảm bảo MongoDB đang chạy trước khi start server
5. **Environment Variables**: Luôn sử dụng file `.env` và không commit nó lên Git
6. **Port**: Mặc định là 5000, có thể thay đổi trong file `.env`
7. **CORS**: Cấu hình CORS origin phù hợp với frontend URL
8. **Password Security**: Passwords được hash với bcrypt, không bao giờ lưu plain text

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB
```
❌ Error connecting to MongoDB
```
**Giải pháp:**
- Kiểm tra MongoDB đã được cài đặt và đang chạy
- Kiểm tra `MONGODB_URI` trong file `.env`
- Thử kết nối qua MongoDB Compass để verify

### Port đã được sử dụng
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Giải pháp:**
- Thay đổi `PORT` trong file `.env`
- Hoặc kill process đang sử dụng port 5000

### JWT Token errors
```
Token không hợp lệ hoặc đã hết hạn
```
**Giải pháp:**
- Đăng nhập lại để lấy token mới
- Kiểm tra `JWT_SECRET` trong `.env` khớp với token
- Token mặc định hết hạn sau 7 ngày

### Authorization errors (403)
```
Bạn không có quyền truy cập
```
**Giải pháp:**
- Bạn đang cố truy cập idea của user khác
- Chỉ có thể CRUD ideas của chính bạn

## 📄 License

ISC

## 👨‍💻 Author

Tạo bởi AI Assistant - Vibe Coding Test

---

**Happy Coding! 🎉**

