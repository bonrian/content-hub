# 🚀 Content Ideas Manager - Frontend

Modern React + TypeScript application với TailwindCSS để quản lý ý tưởng nội dung.

## ✨ Tính năng

- ✅ **Authentication** - Đăng ký, đăng nhập với JWT
- ✅ **Dashboard** - Quản lý tất cả ý tưởng với UI hiện đại
- ✅ **CRUD Operations** - Tạo, xem, sửa, xóa ý tưởng
- ✅ **Filtering & Search** - Lọc theo status, category, priority và tìm kiếm
- ✅ **Statistics** - Thống kê trực quan theo nhiều tiêu chí
- ✅ **Responsive Design** - Tương thích mọi thiết bị
- ✅ **Real-time Toast** - Thông báo trực quan
- ✅ **Protected Routes** - Bảo mật với authentication
- ✅ **TypeScript** - Type-safe code
- ✅ **Beautiful UI** - TailwindCSS với custom components

## 🛠️ Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Context API + Hooks
- **Notifications:** React Hot Toast
- **Icons:** Lucide React

## 📁 Cấu trúc thư mục

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable components
│   │   ├── IdeaCard.tsx
│   │   ├── IdeaForm.tsx
│   │   ├── StatsPanel.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx
│   ├── hooks/               # Custom hooks
│   │   └── useIdeas.ts
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Dashboard.tsx
│   ├── services/            # API services
│   │   └── api.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # App root with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
cd frontend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `env.example`:

```bash
cp env.example .env
```

Cập nhật file `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Chạy development server

```bash
npm run dev
```

App sẽ chạy tại: `http://localhost:3000`

### 4. Build cho production

```bash
npm run build
```

Output sẽ trong thư mục `dist/`

### 5. Preview production build

```bash
npm run preview
```

---

## 📱 Tính năng chi tiết

### 1. Authentication

**Đăng ký:**
- Form với validation
- Name, email, password
- Confirm password matching
- Auto login sau khi đăng ký

**Đăng nhập:**
- Email và password
- JWT token lưu trong localStorage
- Auto redirect đến dashboard

**Logout:**
- Clear token và user data
- Redirect về login page

### 2. Dashboard

**Header:**
- User welcome message
- Stats toggle button
- Logout button

**Toolbar:**
- Search bar với real-time search
- Create new idea button
- Filters: Status, Category, Priority
- View mode toggle (Grid/List)

**Ideas Display:**
- Card/List view modes
- Pagination
- Empty state với CTA

### 3. Idea Management

**Create Idea:**
- Modal form
- Fields: Title*, Description, Category, Status, Priority, Tags
- Tag management (add/remove)
- Validation

**Edit Idea:**
- Pre-filled form
- Same fields as create
- Update confirmation

**Delete Idea:**
- Confirmation dialog
- Toast notification

### 4. Statistics Panel

**Overall Stats:**
- Total ideas count
- Beautiful gradient card

**Breakdown:**
- By Status (Draft, In Progress, Completed, Archived)
- By Priority (Low, Medium, High)
- By Category (Blog, Video, Social Media, etc.)

### 5. Filtering & Search

**Filters:**
- Status filter
- Category filter
- Priority filter
- Combinable filters

**Search:**
- Search by title and description
- Real-time results
- Works with filters

---

## 🎨 UI/UX Features

### Design System

**Colors:**
- Primary: Blue (#0ea5e9)
- Success: Green
- Warning: Yellow
- Danger: Red
- Gray scale for neutrals

**Typography:**
- Font: System fonts
- Sizes: Responsive scale

**Spacing:**
- Consistent spacing system
- Responsive padding/margins

### Components

**Buttons:**
- `.btn` - Base button
- `.btn-primary` - Primary action
- `.btn-secondary` - Secondary action
- `.btn-danger` - Destructive action

**Inputs:**
- `.input` - Base input style
- Focus states
- Error states

**Cards:**
- `.card` - Base card style
- Hover effects
- Shadow elevations

**Badges:**
- Status badges
- Priority badges
- Category badges

### Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Adaptive layouts
- Touch-friendly interactions

---

## 🔧 Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Code Structure

**Components:**
- Functional components with TypeScript
- Props interfaces defined
- Reusable and composable

**State Management:**
- Context API for global state (Auth)
- Local state with useState
- Custom hooks for data fetching

**API Integration:**
- Axios instance with interceptors
- Auto token injection
- Global error handling
- Type-safe API calls

**Routing:**
- React Router v6
- Protected routes
- Route-based code splitting

### TypeScript

**Types Location:**
- Global types: `src/types/index.ts`
- Component props: Inline interfaces
- API responses: Type definitions

**Type Safety:**
- Strict mode enabled
- No implicit any
- Proper type inference

---

## 🔐 Security

### Authentication Flow

1. User logs in → Receives JWT token
2. Token stored in localStorage
3. Token sent in Authorization header
4. Backend validates token
5. Protected routes check authentication

### Protected Routes

```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

- Checks authentication status
- Redirects to login if not authenticated
- Shows loading state

### API Security

- JWT token in headers
- Auto logout on 401
- HTTPS in production
- XSS protection

---

## 🎯 API Integration

### Endpoints Used

```typescript
// Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

// Ideas
GET    /api/ideas
GET    /api/ideas/:id
POST   /api/ideas
PUT    /api/ideas/:id
DELETE /api/ideas/:id
GET    /api/ideas/stats
```

### Request Example

```typescript
import { ideasAPI } from './services/api';

// Create idea
const idea = await ideasAPI.create({
  title: 'My Idea',
  category: 'blog',
  status: 'draft',
  priority: 'high',
  tags: ['tech', 'ai']
});

// Get ideas with filters
const ideas = await ideasAPI.getAll({
  page: 1,
  limit: 10,
  status: 'draft',
  search: 'AI'
});
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Protected routes redirect when not authenticated

**Ideas CRUD:**
- [ ] Create new idea
- [ ] View idea list
- [ ] Edit idea
- [ ] Delete idea with confirmation
- [ ] Form validation works

**Filtering & Search:**
- [ ] Filter by status
- [ ] Filter by category
- [ ] Filter by priority
- [ ] Search by keyword
- [ ] Combine multiple filters

**UI/UX:**
- [ ] Responsive on mobile
- [ ] Toast notifications appear
- [ ] Loading states show
- [ ] Empty states display
- [ ] Error messages clear

---

## 📦 Build & Deploy

### Production Build

```bash
npm run build
```

**Output:**
- Optimized bundle in `dist/`
- Minified JS and CSS
- Tree-shaking applied
- Assets hashed

### Deployment Options

**1. Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**2. Netlify**
- Connect GitHub repo
- Build command: `npm run build`
- Publish directory: `dist`

**3. Static Hosting**
- Upload `dist/` folder
- Configure as SPA
- Set environment variables

### Environment Variables

**Production `.env`:**
```env
VITE_API_URL=https://your-api.com/api
```

---

## 🐛 Troubleshooting

### "API connection failed"
- Kiểm tra backend đang chạy
- Kiểm tra `VITE_API_URL` trong `.env`
- Check CORS configuration

### "Token expired"
- Đăng nhập lại
- JWT_EXPIRE quá ngắn ở backend
- Clear localStorage và thử lại

### "Build failed"
- Run `npm install` lại
- Check Node version (>= 16)
- Clear `node_modules` và reinstall

### "Port 3000 already in use"
- Kill process on port 3000
- Or change port in `vite.config.ts`

---

## 🚀 Future Enhancements

### Planned Features

- [ ] Dark mode support
- [ ] Drag & drop to reorder ideas
- [ ] Idea templates
- [ ] Collaborative features
- [ ] Export to PDF/CSV
- [ ] Calendar view
- [ ] File attachments
- [ ] Rich text editor
- [ ] Mobile app (React Native)

### Performance Optimizations

- [ ] Code splitting per route
- [ ] Image lazy loading
- [ ] Virtual scrolling for large lists
- [ ] Service Worker for offline support
- [ ] React Query for caching

---

## 📄 License

ISC

## 👨‍💻 Author

Created with ❤️ by AI Assistant for Vibe Coding Test

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

**Happy Coding! 🎉**

*Built with React + TypeScript + TailwindCSS*



