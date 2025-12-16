# 🎯 Content Multiplier - AI-Powered Content Ideas Manager

> Full-stack application for managing content ideas with AI-powered generation using Gemini, OpenAI, Anthropic, and Deepseek APIs.

[![MongoDB](https://img.shields.io/badge/MongoDB-4.4-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg)](https://tailwindcss.com/)

---

## 🚀 Features

### ✅ Core Functionality
- **Content Idea Management** - Create, read, update, delete ideas with categories, status, priority
- **AI-Powered Generation** - Generate 10 content ideas instantly using AI (Gemini, OpenAI, Anthropic, Deepseek)
- **Advanced Search & Filter** - Search by title, filter by category/status/priority
- **Analytics Dashboard** - Visual charts and statistics with Recharts
- **JWT Authentication** - Secure user authentication with bcrypt password hashing
- **Optimistic UI Updates** - Instant feedback for better UX

### 🤖 AI Integration
- **Multi-Provider Support**: Gemini, OpenAI, Anthropic, Deepseek
- **Batch Generation**: Generate 10 ideas with persona + industry inputs
- **Smart Validation**: Validates AI responses (title, description, rationale)
- **Retry Mechanism**: Auto-retry up to 3 times with exponential backoff
- **JSON Parsing**: Multiple strategies to extract valid JSON from AI responses

### 📊 Analytics & Visualization
- **Status Distribution** - Pie chart showing draft/in-progress/completed
- **Category Analysis** - Bar chart for blog/video/social-media/podcast/newsletter
- **Priority Insights** - Area chart for high/medium/low priority
- **Statistics Cards** - Total ideas, completion rate, trends

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB 4.4 (Docker)
- **Authentication**: JWT + bcryptjs
- **AI Integration**: 
  - `@google/generative-ai` (Gemini)
  - `openai` SDK
  - `@anthropic-ai/sdk`
  - Axios for REST APIs
- **Validation**: Custom validation (similar to AJV)

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: React Context API + Custom Hooks
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### **DevOps**
- **Database**: Docker Compose (MongoDB 4.4)
- **Development**: Nodemon (backend), Vite HMR (frontend)

---

## 📁 Project Structure

```
content-hub/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── ideaController.js
│   │   │   └── aiController.js
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── User.js
│   │   │   └── Idea.js
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth middleware
│   │   ├── services/          # Business logic
│   │   │   └── aiService.js   # AI integration
│   │   └── server.js          # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.tsx     # Navigation bar
│   │   │   ├── Layout.tsx     # Layout wrapper
│   │   │   ├── IdeaCard.tsx
│   │   │   ├── IdeaForm.tsx
│   │   │   ├── IdeaList.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SimpleIdeaGenerator.tsx
│   │   │   └── charts/        # Recharts components
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Ideas.tsx
│   │   │   ├── IdeaGenerator.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Settings.tsx
│   │   ├── contexts/          # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useIdeas.ts
│   │   │   └── useIdeasOptimistic.ts
│   │   ├── services/          # API services
│   │   │   ├── api.ts
│   │   │   └── aiService.ts
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml          # MongoDB Docker setup
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- Docker & Docker Compose
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/bonrian/content-hub.git
cd content-hub
```

### **2. Setup Backend**

```bash
cd backend
cp .env.example .env
```

**Edit `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/content-ideas
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# AI API Keys (at least one required)
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
```

**Install dependencies:**
```bash
npm install
```

### **3. Setup Frontend**

```bash
cd ../frontend
cp .env.example .env
```

**Edit `.env`:**
```env
VITE_API_URL=http://localhost:5000
```

**Install dependencies:**
```bash
npm install
```

### **4. Start MongoDB**

```bash
cd ..
docker-compose up -d
```

**Verify MongoDB is running:**
```bash
docker ps
```

### **5. Start Backend**

```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
📍 Environment: development
✅ MongoDB Connected: localhost
```

### **6. Start Frontend**

```bash
cd ../frontend
npm run dev
```

**Expected output:**
```
VITE v5.4.21 ready in 3195 ms
➜  Local:   http://localhost:3000/
```

### **7. Open Browser**

Navigate to: **http://localhost:3000**

---

## 📚 API Endpoints

### **Authentication**
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
GET  /api/auth/me          - Get current user (protected)
```

### **Ideas Management**
```
GET    /api/ideas          - Get all ideas (protected)
GET    /api/ideas/:id      - Get single idea (protected)
POST   /api/ideas          - Create idea (protected)
PUT    /api/ideas/:id      - Update idea (protected)
DELETE /api/ideas/:id      - Delete idea (protected)
```

### **AI Generation**
```
POST /api/ai/generate       - Generate single AI content
POST /api/ai/idea           - Generate single idea with AI
POST /api/ai/improve        - Improve existing idea
POST /api/ai/batch-ideas    - Generate 10 ideas (persona + industry)
GET  /api/ai/providers      - List available AI providers
```

---

## 🤖 AI Features

### **Batch Idea Generation**

**Endpoint:** `POST /api/ai/batch-ideas`

**Request Body:**
```json
{
  "persona": "Tech startup founders, 25-40 years old, need growth strategies",
  "industry": "SaaS, B2B Software, Cloud Services",
  "count": 10,
  "provider": "gemini",
  "temperature": 0.9
}
```

**Response:**
```json
{
  "success": true,
  "ideas": [
    {
      "title": "10 Growth Hacking Strategies for SaaS Startups",
      "description": "...",
      "rationale": "...",
      "category": "blog",
      "priority": "high",
      "tags": ["saas", "growth", "startup"]
    }
    // ... 9 more ideas
  ],
  "provider": "gemini",
  "model": "gemini-2.5-flash"
}
```

### **Validation & Retry**

The AI service includes robust validation:
- ✅ Checks for required fields: `title`, `description`, `rationale`
- ✅ Validates data types and formats
- ✅ Retries up to 3 times with exponential backoff (2s → 4s → 8s)
- ✅ Multiple JSON parsing strategies

---

## 🎨 UI Pages

### **1. Dashboard** (`/dashboard`)
- Quick search and filters
- Recent ideas list
- Quick actions (status/priority updates)

### **2. Ideas** (`/ideas`)
- Full CRUD operations
- Advanced search & filter
- Category/status/priority badges
- View detail modal

### **3. AI Generator** (`/generate`)
- Persona + Industry inputs
- Generate 10 ideas button
- Loading spinner with bouncing dots
- Beautiful ideas grid with rationale
- Batch save functionality

### **4. Analytics** (`/analytics`)
- Statistics cards (total, completed, in-progress, completion rate)
- Status distribution pie chart
- Category distribution bar chart
- Priority analysis area chart

### **5. Settings** (`/settings`)
- Profile management
- Security settings (password change, 2FA)
- Notification preferences
- Appearance customization
- Language selection

---

## 🔐 Authentication

### **JWT Token Flow**
1. User registers/logs in → Backend generates JWT
2. Frontend stores token in `localStorage`
3. Axios interceptor auto-injects token in `Authorization` header
4. Backend middleware validates token for protected routes
5. Auto-logout on 401 (token expired)

### **Password Security**
- Bcrypt hashing with salt rounds: 10
- Passwords never stored in plain text
- Secure password comparison

---

## 📊 Data Models

### **User Schema**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### **Idea Schema**
```javascript
{
  title: String (required),
  description: String,
  category: Enum ['blog', 'video', 'social-media', 'podcast', 'newsletter', 'other'],
  status: Enum ['draft', 'in-progress', 'completed', 'archived'],
  priority: Enum ['low', 'medium', 'high'],
  tags: [String],
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Key Features Implemented

| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| User Authentication | ✅ | ✅ | ✅ |
| CRUD Ideas | ✅ | ✅ | ✅ |
| Search & Filter | ✅ | ✅ | ✅ |
| AI Single Generation | ✅ | ✅ | ✅ |
| AI Batch Generation (10 ideas) | ✅ | ✅ | ✅ |
| AI Response Validation | ✅ | N/A | ✅ |
| Retry Mechanism | ✅ | N/A | ✅ |
| Charts & Analytics | N/A | ✅ | ✅ |
| Optimistic Updates | N/A | ✅ | ✅ |
| Toast Notifications | N/A | ✅ | ✅ |
| Navigation Bar | N/A | ✅ | ✅ |
| Settings Page | N/A | ✅ | ✅ |
| Docker MongoDB | ✅ | N/A | ✅ |

---

## 🧪 Testing

### **Test AI Generation**

1. Navigate to `/generate`
2. Enter persona and industry
3. Click "Generate Ideas"
4. Wait 5-10 seconds
5. View 10 AI-generated ideas
6. Click "Save All" to save to database

### **Test Authentication**

1. Register at `/register`
2. Login at `/login`
3. Token stored in localStorage
4. Protected routes accessible
5. Logout clears token

---

## 🔧 Environment Variables

### **Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/content-ideas
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# AI Providers (at least one)
GEMINI_API_KEY=your-key
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key
DEEPSEEK_API_KEY=your-key
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

### **MongoDB won't start**
```bash
# Stop and remove container
docker-compose down
docker volume prune

# Restart
docker-compose up -d
```

### **Backend 401 errors**
- Check JWT token in localStorage
- Verify `JWT_SECRET` matches in backend
- Token might be expired (7 days default)

### **AI generation fails**
- Check AI API keys in backend `.env`
- Verify API quota/limits
- Check backend logs for detailed error

### **Frontend won't connect to backend**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

---

## 📦 Dependencies

### **Backend**
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "@google/generative-ai": "^0.21.0",
  "openai": "^4.77.3",
  "@anthropic-ai/sdk": "^0.32.1",
  "axios": "^1.7.9"
}
```

### **Frontend**
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "axios": "^1.6.2",
  "recharts": "^2.10.3",
  "react-hot-toast": "^2.4.1",
  "lucide-react": "^0.294.0"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 👨‍💻 Author

**Pham Quang Diep**
- GitHub: [@bonrian](https://github.com/bonrian)
- Email: dieppham98tongx@gmail.com

---

## 🎉 Acknowledgments

- [Gemini API](https://ai.google.dev/) for AI generation
- [OpenAI](https://openai.com/) for GPT models
- [Anthropic](https://www.anthropic.com/) for Claude
- [Deepseek](https://www.deepseek.com/) for additional AI support
- [Recharts](https://recharts.org/) for beautiful charts
- [TailwindCSS](https://tailwindcss.com/) for amazing styling

---

## 🚀 What's Next?

- [ ] Export ideas to CSV/PDF
- [ ] Bulk edit operations
- [ ] Team collaboration features
- [ ] Content calendar view
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Multi-language support

---

**⭐ Star this repo if you find it useful!**

**🐛 Found a bug? Open an issue!**

**💡 Have ideas? Submit a feature request!**
