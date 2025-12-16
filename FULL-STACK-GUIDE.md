# 🚀 Full-Stack Application Guide

Hướng dẫn chạy ứng dụng Content Ideas Manager hoàn chỉnh (Backend + Frontend).

---

## 📦 Tổng quan Project

```
vibe-coding-test/
├── backend/              # Node.js + Express + MongoDB API
│   ├── src/
│   ├── package.json
│   └── README.md
├── frontend/             # React + TypeScript + TailwindCSS
│   ├── src/
│   ├── package.json
│   └── README.md
└── FULL-STACK-GUIDE.md   # File này
```

### Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 18 + TypeScript
- Vite build tool
- TailwindCSS
- React Router v6
- Axios for API calls

---

## ⚡ Quick Start (5 phút)

### 1. Prerequisites

Đảm bảo đã cài đặt:
- Node.js >= 16
- MongoDB (local hoặc Atlas)
- npm hoặc yarn

### 2. Backend Setup

```bash
# Terminal 1 - Backend
cd backend
npm install
cp env.example .env
```

Cập nhật `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/content-ideas
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**Khởi động MongoDB:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod

# Or use MongoDB Atlas cloud
```

**Chạy backend:**
```bash
npm run dev
```

✅ Backend chạy tại: `http://localhost:5000`

### 3. Frontend Setup

```bash
# Terminal 2 - Frontend (tab/window mới)
cd frontend
npm install
cp env.example .env
```

Cập nhật `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**Chạy frontend:**
```bash
npm run dev
```

✅ Frontend chạy tại: `http://localhost:3000`

### 4. Test Application

1. Mở browser: `http://localhost:3000`
2. Click "Đăng ký ngay"
3. Tạo tài khoản mới
4. Tự động redirect về Dashboard
5. Tạo ý tưởng đầu tiên!

---

## 🔄 Development Workflow

### Chạy cả 2 services

**Terminal 1 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

### Hoặc sử dụng script tổng hợp (Optional)

Tạo file `package.json` ở root:
```json
{
  "name": "content-ideas-manager",
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"",
    "install-all": "npm install --prefix backend && npm install --prefix frontend"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Sau đó:
```bash
npm install
npm run dev
```

---

## 🧪 Testing Full Stack

### 1. Test Authentication Flow

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

Save token từ response.

### 2. Test Ideas CRUD

**Create Idea:**
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:5000/api/ideas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Idea",
    "category": "blog",
    "priority": "high"
  }'
```

**Get Ideas:**
```bash
curl http://localhost:5000/api/ideas \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Test Frontend UI

1. **Register:** `/register`
   - Điền form
   - Submit
   - Check auto-login

2. **Login:** `/login`
   - Email + password
   - Check redirect to dashboard

3. **Dashboard:** `/dashboard`
   - View ideas list
   - Create new idea
   - Edit idea
   - Delete idea
   - Filter và search
   - View stats

---

## 📊 Data Flow

```
User Action (Frontend)
    ↓
React Component
    ↓
Context/Hook
    ↓
API Service (Axios)
    ↓
HTTP Request with JWT
    ↓
Backend Express Route
    ↓
Auth Middleware (verify JWT)
    ↓
Controller Logic
    ↓
Mongoose Model
    ↓
MongoDB
    ↓
Response back to Frontend
    ↓
Update UI + Toast Notification
```

---

## 🔐 Authentication Flow

```
1. User registers/logs in
   Frontend → POST /api/auth/login
   
2. Backend validates credentials
   Hash password → Compare
   
3. Backend generates JWT token
   jwt.sign({ id, email }, secret)
   
4. Frontend receives token
   Store in localStorage
   
5. Frontend includes token in requests
   Authorization: Bearer <token>
   
6. Backend verifies token
   Middleware → jwt.verify()
   
7. Authorized request proceeds
   Access protected resources
```

---

## 🎯 API Endpoints Overview

### Authentication (Public)
```
POST   /api/auth/register    # Đăng ký
POST   /api/auth/login        # Đăng nhập
```

### User Management (Protected)
```
GET    /api/auth/me           # Thông tin user
PUT    /api/auth/updateprofile
PUT    /api/auth/updatepassword
```

### Ideas Management (Protected)
```
GET    /api/ideas             # Danh sách (pagination, filters)
GET    /api/ideas/stats       # Thống kê
GET    /api/ideas/:id         # Chi tiết
POST   /api/ideas             # Tạo mới
PUT    /api/ideas/:id         # Cập nhật
DELETE /api/ideas/:id         # Xóa
```

---

## 🗂️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Idea Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  category: 'blog' | 'video' | 'social-media' | ...,
  status: 'draft' | 'in-progress' | 'completed' | 'archived',
  priority: 'low' | 'medium' | 'high',
  tags: [String],
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛠️ Common Development Tasks

### Add New Feature

**Backend:**
1. Add route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Update model if needed
4. Test with Postman/cURL

**Frontend:**
1. Add API call in `frontend/src/services/api.ts`
2. Create/update component
3. Add to routing if new page
4. Test in browser

### Add New Field to Idea

**Backend:**
1. Update `backend/src/models/Idea.js`
2. Add validation
3. Test API

**Frontend:**
1. Update `frontend/src/types/index.ts`
2. Update IdeaForm component
3. Update IdeaCard display
4. Test UI

### Debug Issues

**Backend Errors:**
```bash
# Check server logs
cd backend
npm run dev

# Check MongoDB
mongosh
use content-ideas
db.ideas.find()
```

**Frontend Errors:**
```bash
# Check browser console
# Check Network tab
# Verify API URL in .env
```

---

## 🚀 Deployment

### Backend (Heroku/Railway)

```bash
cd backend

# Add to .env in production
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=random-secure-string
CORS_ORIGIN=https://yourapp.com

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)

```bash
cd frontend

# Update .env
VITE_API_URL=https://your-api.herokuapp.com/api

# Build
npm run build

# Deploy
vercel
# or
netlify deploy --prod
```

---

## 📱 Features Showcase

### ✅ Implemented

**Authentication:**
- [x] User registration
- [x] User login/logout
- [x] JWT token management
- [x] Protected routes

**Ideas Management:**
- [x] Create idea
- [x] View ideas list
- [x] Edit idea
- [x] Delete idea
- [x] Filter by status/category/priority
- [x] Search functionality
- [x] Pagination

**Statistics:**
- [x] Total count
- [x] By status breakdown
- [x] By category breakdown
- [x] By priority breakdown

**UI/UX:**
- [x] Responsive design
- [x] Toast notifications
- [x] Loading states
- [x] Empty states
- [x] Form validation
- [x] Confirmation dialogs

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check MongoDB is running
mongosh

# Or use MongoDB Atlas
# Update MONGODB_URI in .env
```

### "CORS error"
```bash
# Check backend CORS_ORIGIN
# Should match frontend URL
# Default: http://localhost:3000
```

### "Token invalid"
```bash
# Check JWT_SECRET matches
# Login again to get new token
# Clear localStorage and try again
```

### "Port already in use"
```bash
# Backend (5000)
lsof -ti:5000 | xargs kill

# Frontend (3000)
lsof -ti:3000 | xargs kill
```

---

## 📚 Documentation Links

- [Backend README](./backend/README.md)
- [Backend API Auth Guide](./backend/AUTH.md)
- [Backend API Testing](./backend/API-TESTING.md)
- [Frontend README](./frontend/README.md)
- [Frontend Quick Start](./frontend/QUICK-START.md)

---

## 🎯 Next Steps

### Immediate
1. ✅ Test all features
2. ✅ Create sample data
3. ✅ Verify authentication works
4. ✅ Check responsive design

### Short-term
- [ ] Add more idea categories
- [ ] Implement idea templates
- [ ] Add file attachments
- [ ] Email notifications

### Long-term
- [ ] Mobile app (React Native)
- [ ] Collaborative features
- [ ] Advanced analytics
- [ ] Export functionality

---

## 💡 Tips

### Development
- Keep both terminals open
- Use browser DevTools
- Check Network tab for API calls
- Use React DevTools

### Production
- Use environment variables
- Enable HTTPS
- Set secure JWT_SECRET
- Monitor errors
- Regular backups

---

## 🤝 Team Collaboration

### Git Workflow
```bash
# Backend changes
cd backend
git add .
git commit -m "feat: add new feature"

# Frontend changes
cd frontend
git add .
git commit -m "feat: add UI component"

# Push both
git push origin main
```

### Code Review
- Backend: Check API logic, security
- Frontend: Check UI/UX, TypeScript types
- Full-stack: Test integration

---

**🎊 Congratulations! Full-stack app is running!**

*Built with ❤️ using Node.js + React + TypeScript + MongoDB*

---

**Need help?**
- Backend issues: See `backend/README.md`
- Frontend issues: See `frontend/README.md`
- API testing: See `backend/API-TESTING.md`
- Auth flow: See `backend/AUTH.md`



