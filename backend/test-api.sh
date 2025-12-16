#!/bin/bash

# Script test API endpoints
BASE_URL="http://localhost:5000/api/ideas"

echo "🧪 Testing Content Ideas API..."
echo ""

# 1. Test GET all ideas
echo "1️⃣ GET /api/ideas - Lấy danh sách"
curl -s "$BASE_URL" | json_pp
echo -e "\n---\n"

# 2. Test POST - Create new idea
echo "2️⃣ POST /api/ideas - Tạo ý tưởng mới"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Idea from Script",
    "description": "This is a test idea",
    "category": "blog",
    "status": "draft",
    "priority": "high",
    "tags": ["test", "automation"]
  }')
echo $RESPONSE | json_pp

# Extract ID from response (requires jq)
ID=$(echo $RESPONSE | jq -r '.data._id')
echo "Created ID: $ID"
echo -e "\n---\n"

# 3. Test GET by ID
echo "3️⃣ GET /api/ideas/:id - Lấy chi tiết"
curl -s "$BASE_URL/$ID" | json_pp
echo -e "\n---\n"

# 4. Test PUT - Update
echo "4️⃣ PUT /api/ideas/:id - Cập nhật"
curl -s -X PUT "$BASE_URL/$ID" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "priority": "medium"
  }' | json_pp
echo -e "\n---\n"

# 5. Test GET with filters
echo "5️⃣ GET /api/ideas?status=draft&priority=high"
curl -s "$BASE_URL?status=draft&priority=high" | json_pp
echo -e "\n---\n"

# 6. Test GET stats
echo "6️⃣ GET /api/ideas/stats - Thống kê"
curl -s "$BASE_URL/stats" | json_pp
echo -e "\n---\n"

# 7. Test DELETE
echo "7️⃣ DELETE /api/ideas/:id - Xóa"
curl -s -X DELETE "$BASE_URL/$ID" | json_pp
echo -e "\n---\n"

echo "✅ Tests completed!"



