# 🎨 Components Guide

Hướng dẫn sử dụng các React components trong ứng dụng.

---

## 📦 Danh sách Components

### 1. **IdeaList** - Danh sách ý tưởng
### 2. **IdeaCard** - Card hiển thị idea
### 3. **IdeaForm** - Form tạo/sửa idea
### 4. **IdeaDetail** - Chi tiết idea
### 5. **FilterBar** - Thanh lọc
### 6. **SearchBar** - Thanh tìm kiếm
### 7. **StatsPanel** - Bảng thống kê
### 8. **ProtectedRoute** - Route bảo vệ

---

## 1. IdeaList Component

### Props

```typescript
interface IdeaListProps {
  ideas: Idea[];
  isLoading: boolean;
  viewMode?: 'grid' | 'list';
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}
```

### Features

- ✅ Grid/List view toggle
- ✅ Loading state với spinner
- ✅ Empty state khi không có data
- ✅ Staggered animation cho cards
- ✅ Results count display

### Usage

```tsx
<IdeaList
  ideas={ideas}
  isLoading={isLoading}
  viewMode="grid"
  onEdit={handleEdit}
  onDelete={handleDelete}
  onViewModeChange={setViewMode}
/>
```

### States

**Loading:**
- Hiển thị spinner với text
- Centered layout

**Empty:**
- Icon placeholder
- Helpful message
- CTA button (nếu có)

**With Data:**
- Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
- List: Full width cards
- View mode toggle

---

## 2. IdeaCard Component

### Props

```typescript
interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onView?: (idea: Idea) => void;
  viewMode?: 'grid' | 'list';
}
```

### Features

- ✅ Hover effects
- ✅ Status/Priority/Category badges
- ✅ Tags display
- ✅ Action buttons (View, Edit, Delete)
- ✅ Truncated description
- ✅ Date formatting
- ✅ Responsive layout

### Badge Colors

**Status:**
- Draft: Gray
- In Progress: Blue
- Completed: Green
- Archived: Yellow

**Priority:**
- Low: Gray
- Medium: Yellow
- High: Red

### Usage

```tsx
<IdeaCard
  idea={idea}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
  viewMode="grid"
/>
```

---

## 3. IdeaForm Component

### Props

```typescript
interface IdeaFormProps {
  idea?: Idea | null;
  onSubmit: (data: IdeaFormData) => Promise<void>;
  onClose: () => void;
}
```

### Features

- ✅ Modal overlay
- ✅ Create/Edit modes
- ✅ Form validation
- ✅ Tag management (add/remove)
- ✅ Loading state on submit
- ✅ Keyboard shortcuts (Enter for tags)
- ✅ Auto-focus on title

### Fields

1. **Title*** - Required, text input
2. **Description** - Optional, textarea
3. **Category** - Select dropdown
4. **Status** - Select dropdown
5. **Priority** - Select dropdown
6. **Tags** - Dynamic chips

### Usage

```tsx
// Create mode
<IdeaForm
  onSubmit={handleCreate}
  onClose={closeModal}
/>

// Edit mode
<IdeaForm
  idea={selectedIdea}
  onSubmit={handleUpdate}
  onClose={closeModal}
/>
```

### Validation

- Title: Required
- Description: Optional, max 2000 chars
- Tags: Can add/remove dynamically

---

## 4. IdeaDetail Component

### Props

```typescript
interface IdeaDetailProps {
  idea: Idea;
  onClose: () => void;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
}
```

### Features

- ✅ Full idea information
- ✅ Status/Priority/Category display
- ✅ Tags with chips
- ✅ Creator information
- ✅ Created/Updated timestamps
- ✅ Action buttons (Edit, Delete)
- ✅ Smooth animations

### Sections

1. **Header** - Title + badges
2. **Description** - Full text
3. **Tags** - All tags with styling
4. **Metadata** - Creator + dates
5. **Actions** - Edit, Delete, Close

### Usage

```tsx
<IdeaDetail
  idea={selectedIdea}
  onClose={closeModal}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

## 5. FilterBar Component

### Props

```typescript
interface FilterBarProps {
  status?: IdeaStatus;
  category?: IdeaCategory;
  priority?: IdeaPriority;
  onStatusChange: (status?: IdeaStatus) => void;
  onCategoryChange: (category?: IdeaCategory) => void;
  onPriorityChange: (priority?: IdeaPriority) => void;
  onClearFilters: () => void;
}
```

### Features

- ✅ 3 filter dropdowns (Status, Category, Priority)
- ✅ Active filters count badge
- ✅ Clear all filters button
- ✅ Active filters display with remove chips
- ✅ Responsive grid layout

### Options

**Status:**
- Tất cả (default)
- Nháp
- Đang làm
- Hoàn thành
- Lưu trữ

**Category:**
- Tất cả (default)
- Blog
- Video
- Social Media
- Podcast
- Newsletter
- Khác

**Priority:**
- Tất cả (default)
- Cao
- Trung bình
- Thấp

### Usage

```tsx
<FilterBar
  status={filters.status}
  category={filters.category}
  priority={filters.priority}
  onStatusChange={(status) => setFilters({...filters, status})}
  onCategoryChange={(category) => setFilters({...filters, category})}
  onPriorityChange={(priority) => setFilters({...filters, priority})}
  onClearFilters={() => setFilters({})}
/>
```

---

## 6. SearchBar Component

### Props

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  isLoading?: boolean;
}
```

### Features

- ✅ Debounced search (default 500ms)
- ✅ Clear button
- ✅ Loading indicator
- ✅ Submit on Enter
- ✅ Search term display

### Usage

```tsx
<SearchBar
  onSearch={handleSearch}
  placeholder="Tìm kiếm ý tưởng..."
  debounceMs={500}
  isLoading={isSearching}
/>
```

### Behavior

1. User types → Debounce timer starts
2. Timer expires → Trigger search
3. User presses Enter → Immediate search
4. Clear button → Reset search

---

## 7. StatsPanel Component

### Props

```typescript
interface StatsPanelProps {
  stats: StatsData;
}
```

### Features

- ✅ Total count card (gradient)
- ✅ 3 breakdown cards (Status, Priority, Category)
- ✅ Icons for visual clarity
- ✅ Responsive grid

### Display

**Total Card:**
- Large number display
- Gradient background
- Icon

**Breakdown Cards:**
- List of items with counts
- Category labels
- Clean layout

### Usage

```tsx
<StatsPanel stats={stats} />
```

---

## 8. ProtectedRoute Component

### Props

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

### Features

- ✅ Check authentication status
- ✅ Loading state while checking
- ✅ Auto redirect to login

### Usage

```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## 🎨 Styling Guidelines

### Colors

```css
Primary: #0ea5e9 (Blue)
Success: #10b981 (Green)
Warning: #f59e0b (Yellow)
Danger: #ef4444 (Red)
Gray: #6b7280
```

### Spacing

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
```

### Shadows

```
sm: shadow-sm
md: shadow-md
lg: shadow-lg
xl: shadow-xl
2xl: shadow-2xl
```

### Border Radius

```
sm: 0.375rem (6px)
md: 0.5rem (8px)
lg: 0.75rem (12px)
xl: 1rem (16px)
```

---

## 🔄 Animations

### Available Animations

```css
.animate-fadeIn - Fade in effect
.animate-slideUp - Slide up effect
.animate-slideDown - Slide down effect
```

### Usage

```tsx
<div className="animate-fadeIn">
  Content
</div>
```

---

## 💡 Best Practices

### 1. Props

- Always define TypeScript interfaces
- Use optional props with `?`
- Provide default values

### 2. State

- Use local state for UI
- Use context for global state
- Custom hooks for data fetching

### 3. Events

- Name handlers with `handle` prefix
- Use arrow functions in JSX
- Prevent default when needed

### 4. Styling

- Use Tailwind utility classes
- Custom classes in index.css
- Consistent spacing

### 5. Performance

- Memoize expensive calculations
- Use keys in lists
- Lazy load when possible

---

## 🧪 Testing Examples

### IdeaList

```tsx
// Test empty state
<IdeaList
  ideas={[]}
  isLoading={false}
  onEdit={jest.fn()}
  onDelete={jest.fn()}
/>

// Test loading state
<IdeaList
  ideas={[]}
  isLoading={true}
  onEdit={jest.fn()}
  onDelete={jest.fn()}
/>

// Test with data
<IdeaList
  ideas={mockIdeas}
  isLoading={false}
  onEdit={jest.fn()}
  onDelete={jest.fn()}
/>
```

---

## 📱 Responsive Breakpoints

```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Mobile Considerations

- Full-width components
- Stacked layouts
- Larger touch targets
- Simplified navigation

### Desktop Considerations

- Multi-column grids
- Hover effects
- Keyboard shortcuts
- More information density

---

## 🎯 Component Combinations

### Dashboard Page

```tsx
<Dashboard>
  <StatsPanel />
  <SearchBar />
  <FilterBar />
  <IdeaList>
    <IdeaCard />
  </IdeaList>
  <IdeaForm />
  <IdeaDetail />
</Dashboard>
```

### Typical Flow

1. User searches → SearchBar
2. User filters → FilterBar
3. Results shown → IdeaList
4. Click card → IdeaDetail
5. Click edit → IdeaForm
6. Submit → Refresh list

---

**🎨 Build beautiful UIs with these components!**



