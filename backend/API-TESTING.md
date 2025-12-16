# 🧪 API Testing Guide

Hướng dẫn chi tiết cách test các API endpoints.

## 🚀 Setup

1. Đảm bảo server đang chạy:
```bash
cd backend
npm run dev
```

2. Server chạy tại: `http://localhost:5000`

---

## 📋 Test Cases với cURL

### ✅ 1. GET /api/ideas - Lấy danh sách

#### Test 1.1: Lấy tất cả (default pagination)
```bash
curl http://localhost:5000/api/ideas
```

**Expected Response:** Status 200
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "totalPages": 3,
  "currentPage": 1,
  "data": [...]
}
```

#### Test 1.2: Pagination
```bash
# Trang 2, 5 items mỗi trang
curl "http://localhost:5000/api/ideas?page=2&limit=5"
```

#### Test 1.3: Filter theo status
```bash
curl "http://localhost:5000/api/ideas?status=draft"
curl "http://localhost:5000/api/ideas?status=in-progress"
curl "http://localhost:5000/api/ideas?status=completed"
```

#### Test 1.4: Filter theo category
```bash
curl "http://localhost:5000/api/ideas?category=blog"
curl "http://localhost:5000/api/ideas?category=video"
```

#### Test 1.5: Filter theo priority
```bash
curl "http://localhost:5000/api/ideas?priority=high"
curl "http://localhost:5000/api/ideas?priority=medium"
```

#### Test 1.6: Search
```bash
# Tìm kiếm trong title và description
curl "http://localhost:5000/api/ideas?search=AI"
curl "http://localhost:5000/api/ideas?search=react"
```

#### Test 1.7: Kết hợp nhiều filters
```bash
curl "http://localhost:5000/api/ideas?status=draft&priority=high&category=blog&page=1&limit=10"
```

---

### ✅ 2. POST /api/ideas - Tạo mới

#### Test 2.1: Tạo idea với tất cả fields
```bash
curl -X POST http://localhost:5000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Viết blog về AI",
    "description": "Bài viết chi tiết về trí tuệ nhân tạo và ứng dụng",
    "category": "blog",
    "status": "draft",
    "priority": "high",
    "tags": ["AI", "Technology", "Machine Learning"]
  }'
```

**Expected Response:** Status 201
```json
{
  "success": true,
  "message": "Tạo ý tưởng thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Viết blog về AI",
    ...
  }
}
```

#### Test 2.2: Tạo idea với chỉ title (minimum required)
```bash
curl -X POST http://localhost:5000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Idea đơn giản"
  }'
```

#### Test 2.3: Tạo video idea
```bash
curl -X POST http://localhost:5000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Video hướng dẫn React Hooks",
    "description": "Video 30 phút về useState, useEffect, useContext",
    "category": "video",
    "priority": "high",
    "tags": ["React", "JavaScript", "Tutorial"]
  }'
```

#### Test 2.4: Tạo social media idea
```bash
curl -X POST http://localhost:5000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Post Instagram về coding tips",
    "description": "Series 10 tips cho developers",
    "category": "social-media",
    "status": "in-progress",
    "priority": "medium",
    "tags": ["Instagram", "Tips", "Coding"]
  }'
```

#### Test 2.5: Error - Thiếu title (validation)
```bash
curl -X POST http://localhost:5000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Không có title"
  }'
```

**Expected Response:** Status 400
```json
{
  "success": false,
  "message": "Tiêu đề là bắt buộc"
}
```

#### Test 2.6: Error - Category không hợp lệ
```bash
curl -X POST http://localhost:5000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "category": "invalid-category"
  }'
```

**Expected Response:** Status 400 (Mongoose validation error)

---

### ✅ 3. GET /api/ideas/:id - Lấy chi tiết

#### Test 3.1: Lấy idea hợp lệ
```bash
# Thay ID bằng ID thực tế từ database
curl http://localhost:5000/api/ideas/507f1f77bcf86cd799439011
```

**Expected Response:** Status 200
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "...",
    ...
  }
}
```

#### Test 3.2: Error - ID không tồn tại
```bash
curl http://localhost:5000/api/ideas/507f1f77bcf86cd799439999
```

**Expected Response:** Status 404
```json
{
  "success": false,
  "message": "Không tìm thấy ý tưởng"
}
```

#### Test 3.3: Error - ID không hợp lệ
```bash
curl http://localhost:5000/api/ideas/invalid-id-format
```

**Expected Response:** Status 404
```json
{
  "success": false,
  "message": "ID không hợp lệ"
}
```

---

### ✅ 4. PUT /api/ideas/:id - Cập nhật

#### Test 4.1: Cập nhật status
```bash
curl -X PUT http://localhost:5000/api/ideas/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress"
  }'
```

#### Test 4.2: Cập nhật priority
```bash
curl -X PUT http://localhost:5000/api/ideas/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "low"
  }'
```

#### Test 4.3: Cập nhật nhiều fields
```bash
curl -X PUT http://localhost:5000/api/ideas/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tiêu đề đã cập nhật",
    "status": "completed",
    "priority": "medium",
    "tags": ["updated", "completed"]
  }'
```

**Expected Response:** Status 200
```json
{
  "success": true,
  "message": "Cập nhật ý tưởng thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    ...
  }
}
```

#### Test 4.4: Error - ID không tồn tại
```bash
curl -X PUT http://localhost:5000/api/ideas/507f1f77bcf86cd799439999 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

**Expected Response:** Status 404

---

### ✅ 5. DELETE /api/ideas/:id - Xóa

#### Test 5.1: Xóa idea hợp lệ
```bash
curl -X DELETE http://localhost:5000/api/ideas/507f1f77bcf86cd799439011
```

**Expected Response:** Status 200
```json
{
  "success": true,
  "message": "Xóa ý tưởng thành công",
  "data": {}
}
```

#### Test 5.2: Error - Xóa ID đã bị xóa
```bash
# Gọi lại lần nữa với ID vừa xóa
curl -X DELETE http://localhost:5000/api/ideas/507f1f77bcf86cd799439011
```

**Expected Response:** Status 404

---

### ✅ 6. GET /api/ideas/stats - Thống kê

#### Test 6.1: Lấy thống kê
```bash
curl http://localhost:5000/api/ideas/stats
```

**Expected Response:** Status 200
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
    "byCategory": [
      { "_id": "blog", "count": 12 },
      { "_id": "video", "count": 8 }
    ],
    "byPriority": [
      { "_id": "high", "count": 10 },
      { "_id": "medium", "count": 10 },
      { "_id": "low", "count": 5 }
    ]
  }
}
```

---

## 🔄 Full Workflow Test

### Scenario: Tạo và quản lý một ý tưởng hoàn chỉnh

```bash
# 1. Tạo ý tưởng mới
ID=$(curl -s -X POST http://localhost:5000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Blog về Docker",
    "description": "Hướng dẫn Docker cho beginners",
    "category": "blog",
    "status": "draft",
    "priority": "high",
    "tags": ["Docker", "DevOps"]
  }' | jq -r '.data._id')

echo "Created ID: $ID"

# 2. Xem chi tiết
curl http://localhost:5000/api/ideas/$ID

# 3. Bắt đầu làm - update status
curl -X PUT http://localhost:5000/api/ideas/$ID \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'

# 4. Hoàn thành - update status
curl -X PUT http://localhost:5000/api/ideas/$ID \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# 5. Kiểm tra trong danh sách completed
curl "http://localhost:5000/api/ideas?status=completed"

# 6. (Optional) Xóa
curl -X DELETE http://localhost:5000/api/ideas/$ID
```

---

## 🧪 Postman Collection

Bạn có thể import collection này vào Postman:

### JSON for Postman:
```json
{
  "info": {
    "name": "Content Ideas API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Ideas",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/ideas"
      }
    },
    {
      "name": "Get Idea by ID",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/ideas/{{ideaId}}"
      }
    },
    {
      "name": "Create Idea",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/ideas",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Test Idea\",\n  \"description\": \"Test description\",\n  \"category\": \"blog\",\n  \"priority\": \"high\"\n}"
        }
      }
    },
    {
      "name": "Update Idea",
      "request": {
        "method": "PUT",
        "url": "http://localhost:5000/api/ideas/{{ideaId}}",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"completed\"\n}"
        }
      }
    },
    {
      "name": "Delete Idea",
      "request": {
        "method": "DELETE",
        "url": "http://localhost:5000/api/ideas/{{ideaId}}"
      }
    }
  ]
}
```

---

## ✅ Checklist Testing

- [ ] GET /api/ideas - Lấy tất cả
- [ ] GET /api/ideas với pagination
- [ ] GET /api/ideas với filters (status, category, priority)
- [ ] GET /api/ideas với search
- [ ] GET /api/ideas/:id - ID hợp lệ
- [ ] GET /api/ideas/:id - ID không tồn tại
- [ ] GET /api/ideas/:id - ID format sai
- [ ] POST /api/ideas - Tạo mới thành công
- [ ] POST /api/ideas - Thiếu title (error)
- [ ] POST /api/ideas - Category không hợp lệ (error)
- [ ] PUT /api/ideas/:id - Cập nhật thành công
- [ ] PUT /api/ideas/:id - ID không tồn tại (error)
- [ ] DELETE /api/ideas/:id - Xóa thành công
- [ ] DELETE /api/ideas/:id - ID không tồn tại (error)
- [ ] GET /api/ideas/stats - Lấy thống kê

---

## 🐛 Common Issues

### Issue 1: Connection refused
```
curl: (7) Failed to connect to localhost port 5000
```
**Solution:** Đảm bảo server đang chạy (`npm run dev`)

### Issue 2: MongoDB connection error
```
❌ Error connecting to MongoDB
```
**Solution:** Kiểm tra MongoDB đã chạy và MONGODB_URI trong .env

### Issue 3: 404 for all routes
```
Cannot GET /api/ideas
```
**Solution:** Kiểm tra routes đã được mount trong server.js

---

**Happy Testing! 🎉**



