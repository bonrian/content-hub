# 🔌 API Integration Guide

Hướng dẫn chi tiết về tích hợp frontend với backend API.

---

## 📋 Tổng quan

Frontend React đã được tích hợp hoàn chỉnh với Backend API thông qua:

1. ✅ **Axios Service Layer** - Centralized API calls
2. ✅ **Custom Hooks** - Data fetching với React Hooks
3. ✅ **Optimistic Updates** - Instant UI feedback
4. ✅ **Error Handling** - Comprehensive error management
5. ✅ **Toast Notifications** - User feedback
6. ✅ **Loading States** - UI indicators
7. ✅ **Request Interceptors** - Auto token injection
8. ✅ **Response Interceptors** - Auto error handling

---

## 🏗️ Architecture

### Service Layer Structure

```
frontend/src/
├── services/
│   └── api.ts              # Axios instance + API methods
├── hooks/
│   ├── useIdeas.ts         # Basic data fetching
│   └── useIdeasOptimistic.ts  # With optimistic updates
├── utils/
│   └── errorHandler.ts     # Error handling utilities
└── contexts/
    └── AuthContext.tsx     # Authentication state
```

---

## 1️⃣ API Service Layer

### Axios Instance Setup

```typescript:frontend/src/services/api.ts
import axios from 'axios';

// Create axios instance with base config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Methods

```typescript
// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Ideas API
export const ideasAPI = {
  getAll: (filters) => api.get('/ideas', { params: filters }),
  getById: (id) => api.get(`/ideas/${id}`),
  create: (data) => api.post('/ideas', data),
  update: (id, data) => api.put(`/ideas/${id}`, data),
  delete: (id) => api.delete(`/ideas/${id}`),
  getStats: () => api.get('/ideas/stats'),
};
```

---

## 2️⃣ React Hooks Implementation

### Basic Hook - useIdeas

```typescript:frontend/src/hooks/useIdeas.ts
export const useIdeas = (filters?: IdeaFilters) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      const response = await ideasAPI.getAll(filters);
      setIdeas(response.data);
    } catch (err) {
      setError(handleApiError(err));
      toast.error('Lỗi khi tải danh sách');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [filters]);

  const createIdea = async (data: IdeaFormData) => {
    const response = await ideasAPI.create(data);
    toast.success('Tạo thành công!');
    await fetchIdeas(); // Reload list
    return response.data;
  };

  return {
    ideas,
    isLoading,
    error,
    createIdea,
    updateIdea,
    deleteIdea,
  };
};
```

### Enhanced Hook - useIdeasOptimistic

```typescript:frontend/src/hooks/useIdeasOptimistic.ts
export const useIdeasOptimistic = (filters?: IdeaFilters) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  /**
   * Create with optimistic update
   */
  const createIdea = async (data: IdeaFormData) => {
    // 1. Create temporary optimistic idea
    const optimisticIdea: Idea = {
      _id: `temp-${Date.now()}`,
      ...data,
      user: { _id: 'current', name: 'You', email: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 2. Optimistically add to UI
    setIdeas((prev) => [optimisticIdea, ...prev]);
    
    const toastId = toast.loading('Đang tạo...');

    try {
      // 3. Make actual API call
      const response = await ideasAPI.create(data);
      
      // 4. Replace optimistic with real data
      setIdeas((prev) =>
        prev.map((idea) =>
          idea._id === optimisticIdea._id ? response.data : idea
        )
      );
      
      toast.success('Tạo thành công!', { id: toastId });
    } catch (err) {
      // 5. Rollback on error
      setIdeas((prev) =>
        prev.filter((idea) => idea._id !== optimisticIdea._id)
      );
      
      toast.error('Lỗi khi tạo', { id: toastId });
      throw err;
    }
  };

  return { ideas, createIdea, /* ... */ };
};
```

---

## 3️⃣ Optimistic Updates Pattern

### Why Optimistic Updates?

**Traditional Flow:**
```
User clicks → Show loading → API call → Update UI
(Feels slow, 1-2s delay)
```

**Optimistic Flow:**
```
User clicks → Update UI instantly → API call in background → Fix if error
(Feels instant, 0s delay)
```

### Implementation Steps

**1. Store Original State**
```typescript
const originalIdea = ideas.find(idea => idea._id === id);
```

**2. Optimistically Update UI**
```typescript
setIdeas(prev => prev.map(idea => 
  idea._id === id ? { ...idea, status: 'completed' } : idea
));
```

**3. Make API Call**
```typescript
try {
  await ideasAPI.update(id, { status: 'completed' });
  toast.success('Updated!');
} catch (err) {
  // Rollback...
}
```

**4. Rollback on Error**
```typescript
setIdeas(prev => prev.map(idea =>
  idea._id === id ? originalIdea : idea
));
toast.error('Failed!');
```

### Complete Example

```typescript
const deleteIdea = async (id: string) => {
  // Store original
  const original = ideas.find(i => i._id === id);
  const originalIndex = ideas.findIndex(i => i._id === id);
  
  // Optimistic remove
  setIdeas(prev => prev.filter(i => i._id !== id));
  
  const toastId = toast.loading('Đang xóa...');
  
  try {
    await ideasAPI.delete(id);
    toast.success('Xóa thành công!', { id: toastId });
  } catch (err) {
    // Rollback: restore at original position
    setIdeas(prev => {
      const newIdeas = [...prev];
      newIdeas.splice(originalIndex, 0, original);
      return newIdeas;
    });
    
    toast.error('Lỗi khi xóa', { id: toastId });
  }
};
```

---

## 4️⃣ Error Handling

### Error Handler Utility

```typescript:frontend/src/utils/errorHandler.ts
export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // API error message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    // HTTP status based
    switch (error.response?.status) {
      case 400: return 'Dữ liệu không hợp lệ';
      case 401: return 'Vui lòng đăng nhập lại';
      case 403: return 'Không có quyền truy cập';
      case 404: return 'Không tìm thấy';
      case 500: return 'Lỗi server';
      default: return 'Đã có lỗi xảy ra';
    }
  }
  
  // Network error
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return 'Không kết nối được server';
    }
  }
  
  return 'Lỗi không xác định';
};
```

### Usage in Components

```typescript
try {
  await createIdea(data);
} catch (error) {
  const message = handleApiError(error);
  toast.error(message);
}
```

---

## 5️⃣ Loading States

### Types of Loading States

**1. Initial Loading**
```typescript
const [isLoading, setIsLoading] = useState(true);

if (isLoading) {
  return <Spinner />;
}
```

**2. Button Loading**
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

<button disabled={isSubmitting}>
  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
</button>
```

**3. Inline Loading**
```typescript
{isSearching && <Loader className="animate-spin" />}
```

**4. Toast Loading**
```typescript
const toastId = toast.loading('Đang xử lý...');
// ... do work ...
toast.success('Xong!', { id: toastId });
```

### Loading Component

```tsx
export const LoadingState = ({ message = 'Đang tải...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
    <p className="text-gray-600">{message}</p>
  </div>
);
```

---

## 6️⃣ Toast Notifications

### Setup (Already Done)

```tsx:frontend/src/App.tsx
import { Toaster } from 'react-hot-toast';

<Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    success: { iconTheme: { primary: '#10b981' } },
    error: { iconTheme: { primary: '#ef4444' } },
  }}
/>
```

### Usage Patterns

**1. Simple Toast**
```typescript
toast.success('Thành công!');
toast.error('Lỗi!');
toast.loading('Đang xử lý...');
```

**2. Toast with ID (for updates)**
```typescript
const toastId = toast.loading('Đang lưu...');
// ... do work ...
toast.success('Đã lưu!', { id: toastId });
// or
toast.error('Lỗi!', { id: toastId });
```

**3. Custom Duration**
```typescript
toast.success('Message', { duration: 5000 });
```

**4. Custom Position**
```typescript
toast.error('Error', { position: 'bottom-center' });
```

**5. Promise Toast**
```typescript
toast.promise(
  apiCall(),
  {
    loading: 'Đang xử lý...',
    success: 'Thành công!',
    error: 'Lỗi!',
  }
);
```

---

## 7️⃣ Request Flow Examples

### Complete CRUD Flow

**1. Create Idea**
```
User fills form → Submit
  ↓
Validate data client-side
  ↓
Show loading toast
  ↓
Optimistic: Add to UI instantly
  ↓
API: POST /api/ideas
  ↓
Success: Update with real data
Error: Rollback + show error
  ↓
Update toast
```

**2. Update Idea**
```
User edits form → Submit
  ↓
Optimistic: Update UI instantly
  ↓
API: PUT /api/ideas/:id
  ↓
Success: Confirm with server data
Error: Rollback to original
  ↓
Toast notification
```

**3. Delete Idea**
```
User clicks delete → Confirm
  ↓
Optimistic: Remove from UI
  ↓
API: DELETE /api/ideas/:id
  ↓
Success: Keep removed
Error: Restore to original position
  ↓
Toast notification
```

**4. Search/Filter**
```
User types/selects → Debounce
  ↓
Update filters state
  ↓
useEffect triggers
  ↓
API: GET /api/ideas?search=...&status=...
  ↓
Update ideas list
  ↓
Update pagination
```

---

## 8️⃣ Performance Optimizations

### 1. Debounced Search

```typescript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedTerm, setDebouncedTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
  }, 500);
  
  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  // Only search when debounced term changes
  fetchIdeas(debouncedTerm);
}, [debouncedTerm]);
```

### 2. Request Cancellation

```typescript
useEffect(() => {
  const controller = new AbortController();
  
  fetchIdeas(filters, controller.signal);
  
  return () => controller.abort(); // Cancel on unmount
}, [filters]);
```

### 3. Caching with Timestamps

```typescript
const [cache, setCache] = useState({
  data: null,
  timestamp: 0,
});

const CACHE_DURATION = 60000; // 1 minute

const fetchWithCache = async () => {
  if (Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.data; // Return cached
  }
  
  const data = await fetchData();
  setCache({ data, timestamp: Date.now() });
  return data;
};
```

### 4. Pagination Strategy

```typescript
// Only fetch page data, not entire list
const fetchPage = async (page: number) => {
  const response = await ideasAPI.getAll({ page, limit: 12 });
  setIdeas(response.data); // Replace, not append
  setPagination(response.pagination);
};
```

---

## 9️⃣ Error Recovery Strategies

### 1. Retry Logic

```typescript
const retryRequest = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    await new Promise(r => setTimeout(r, 1000));
    return retryRequest(fn, retries - 1);
  }
};

// Usage
const data = await retryRequest(() => ideasAPI.getAll());
```

### 2. Offline Detection

```typescript
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => {
    setIsOnline(true);
    toast.success('Đã kết nối lại!');
    refetch(); // Retry failed requests
  };
  
  const handleOffline = () => {
    setIsOnline(false);
    toast.error('Mất kết nối mạng!');
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

### 3. Graceful Degradation

```typescript
try {
  const ideas = await ideasAPI.getAll(filters);
  setIdeas(ideas.data);
} catch (error) {
  // Show cached data if available
  if (cachedIdeas.length > 0) {
    setIdeas(cachedIdeas);
    toast.error('Hiển thị dữ liệu cũ (offline)');
  } else {
    setError('Không thể tải dữ liệu');
  }
}
```

---

## 🔟 Testing API Integration

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Auto logout on 401
- [ ] Token persists on page reload

**CRUD Operations:**
- [ ] Create idea (optimistic)
- [ ] Create idea (with error)
- [ ] Update idea (optimistic)
- [ ] Update idea (with error - rollback)
- [ ] Delete idea (optimistic)
- [ ] Delete idea (with error - restore)

**Search & Filter:**
- [ ] Search (debounced)
- [ ] Filter by status
- [ ] Filter by category
- [ ] Filter by priority
- [ ] Combine filters
- [ ] Clear filters

**Error Handling:**
- [ ] Network error
- [ ] 400 Bad Request
- [ ] 401 Unauthorized
- [ ] 403 Forbidden
- [ ] 404 Not Found
- [ ] 500 Server Error

**UX:**
- [ ] Loading states show
- [ ] Success toasts appear
- [ ] Error toasts appear
- [ ] Optimistic updates work
- [ ] Rollback on error works

---

## 📊 API Call Statistics

### Current Implementation

| Feature | Method | Optimistic | Toast | Rollback |
|---------|--------|------------|-------|----------|
| **Auth** |
| Register | POST | ❌ | ✅ | N/A |
| Login | POST | ❌ | ✅ | N/A |
| Logout | Local | ❌ | ✅ | N/A |
| **Ideas** |
| List | GET | ❌ | ❌ | N/A |
| Detail | GET | ❌ | ❌ | N/A |
| Create | POST | ✅ | ✅ | ✅ |
| Update | PUT | ✅ | ✅ | ✅ |
| Delete | DELETE | ✅ | ✅ | ✅ |
| Stats | GET | ❌ | ❌ | N/A |
| **Search** |
| Search | GET | ❌ | ❌ | N/A |

---

## 🎯 Best Practices

### Do's ✅

1. **Use TypeScript** - Type all API responses
2. **Centralize API calls** - One place to manage
3. **Handle errors gracefully** - User-friendly messages
4. **Show loading states** - User knows something is happening
5. **Use optimistic updates** - For instant feedback
6. **Implement rollback** - Restore on error
7. **Debounce searches** - Reduce API calls
8. **Cache when possible** - Improve performance
9. **Show toast notifications** - Inform users
10. **Handle 401 automatically** - Auto logout

### Don'ts ❌

1. ❌ Don't ignore errors silently
2. ❌ Don't fetch on every render
3. ❌ Don't forget to cancel requests
4. ❌ Don't skip loading states
5. ❌ Don't expose API errors directly
6. ❌ Don't forget to clean up effects
7. ❌ Don't make unnecessary API calls
8. ❌ Don't forget pagination
9. ❌ Don't skip validation
10. ❌ Don't hardcode API URLs

---

## 🚀 Next Steps

### Enhancements

1. **React Query** - Consider migrating for advanced caching
2. **WebSocket** - Real-time updates
3. **Service Worker** - Offline support
4. **Request Queue** - Queue requests when offline
5. **Infinite Scroll** - Load more on scroll
6. **Upload Progress** - For file uploads
7. **Batch Operations** - Bulk delete/update
8. **API Mocking** - MSW for development

---

**🔌 API Integration is Complete and Production-Ready!**

*See code in:*
- `frontend/src/services/api.ts`
- `frontend/src/hooks/useIdeasOptimistic.ts`
- `frontend/src/utils/errorHandler.ts`



