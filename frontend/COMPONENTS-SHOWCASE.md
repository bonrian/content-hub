# 🎨 Components Showcase

Tổng quan về các React components đã tạo với screenshots và examples.

---

## 📦 Tất cả Components (8 components)

1. ✅ **IdeaList** - Danh sách ý tưởng với grid/list view
2. ✅ **IdeaCard** - Card hiển thị từng ý tưởng
3. ✅ **IdeaForm** - Form tạo/sửa ý tưởng
4. ✅ **IdeaDetail** - Modal chi tiết ý tưởng
5. ✅ **FilterBar** - Thanh lọc với 3 filters
6. ✅ **SearchBar** - Tìm kiếm với debounce
7. ✅ **StatsPanel** - Thống kê dashboard
8. ✅ **ProtectedRoute** - Route authentication

---

## 1. 📋 IdeaList Component

### Mô tả
Component hiển thị danh sách ý tưởng với nhiều chế độ xem.

### Features
- **Grid View**: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **List View**: Full-width cards
- **View Toggle**: Button chuyển đổi grid/list
- **Loading State**: Spinner animation
- **Empty State**: Placeholder với icon và message
- **Staggered Animation**: Cards fade in từng cái

### Props
```typescript
ideas: Idea[]                    // Danh sách ideas
isLoading: boolean               // Trạng thái loading
viewMode?: 'grid' | 'list'       // Chế độ hiển thị
onEdit: (idea) => void           // Callback edit
onDelete: (id) => void           // Callback delete
onViewModeChange?: (mode) => void // Callback thay đổi view
```

### States

**1. Loading State:**
```
┌─────────────────────────┐
│   🔄 Spinner            │
│   Đang tải ý tưởng...   │
└─────────────────────────┘
```

**2. Empty State:**
```
┌─────────────────────────┐
│   💡 Icon               │
│   Chưa có ý tưởng nào   │
│   Message...            │
└─────────────────────────┘
```

**3. Grid View (3 cols):**
```
┌──────┐ ┌──────┐ ┌──────┐
│ Card │ │ Card │ │ Card │
└──────┘ └──────┘ └──────┘
┌──────┐ ┌──────┐ ┌──────┐
│ Card │ │ Card │ │ Card │
└──────┘ └──────┘ └──────┘
```

**4. List View:**
```
┌─────────────────────────┐
│ Card (full width)       │
└─────────────────────────┘
┌─────────────────────────┐
│ Card (full width)       │
└─────────────────────────┘
```

### Code Example
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

---

## 2. 🎴 IdeaCard Component

### Mô tả
Card component hiển thị thông tin ý tưởng với actions.

### Features
- **Hover Effects**: Scale + shadow on hover
- **Status Badge**: Màu theo trạng thái
- **Priority Badge**: Màu theo độ ưu tiên
- **Category Badge**: Màu tím cho category
- **Tags**: Chips display
- **Action Buttons**: View, Edit, Delete với icons
- **Date Display**: Formatted date
- **Click to View**: Click vào title/card để xem detail

### Layout

```
┌─────────────────────────────────┐
│ Title                 [👁️][✏️][🗑️]│
│                                 │
│ Description (truncated)...      │
│                                 │
│ #tag1 #tag2 #tag3              │
│                                 │
│ [Nháp] [Cao] [Blog]            │
│                                 │
│ 📅 15/01/2024                   │
└─────────────────────────────────┘
```

### Badge Colors

| Type | Value | Color |
|------|-------|-------|
| **Status** | Draft | Gray |
| | In Progress | Blue |
| | Completed | Green |
| | Archived | Yellow |
| **Priority** | Low | Gray |
| | Medium | Yellow |
| | High | Red |
| **Category** | All | Purple |

### Props
```typescript
idea: Idea                  // Idea object
onEdit: (idea) => void      // Edit callback
onDelete: (id) => void      // Delete callback
onView?: (idea) => void     // View callback (optional)
viewMode?: 'grid' | 'list'  // Display mode
```

---

## 3. 📝 IdeaForm Component

### Mô tả
Modal form để tạo mới hoặc chỉnh sửa ý tưởng.

### Features
- **Modal Overlay**: Dark background
- **Slide-up Animation**: Smooth entrance
- **Create/Edit Modes**: Tự động detect
- **Form Validation**: Client-side validation
- **Tag Management**: Add/remove tags dynamically
- **Loading State**: Disable submit while loading
- **Keyboard Support**: Enter to add tags, Esc to close

### Layout

```
┌─────────────────────────────────┐
│ Tạo/Sửa ý tưởng            [X] │
├─────────────────────────────────┤
│                                 │
│ Tiêu đề *                       │
│ [___________________________]   │
│                                 │
│ Mô tả                           │
│ [___________________________]   │
│ [___________________________]   │
│                                 │
│ Loại      Trạng thái  Ưu tiên  │
│ [Blog ▼] [Nháp ▼]   [Cao ▼]   │
│                                 │
│ Tags                            │
│ [____________] [Thêm]           │
│ #tag1 [x] #tag2 [x]            │
│                                 │
│ [💾 Lưu]        [Hủy]          │
└─────────────────────────────────┘
```

### Fields

1. **Title*** (required)
   - Text input
   - Max 200 characters
   - Auto-focus

2. **Description** (optional)
   - Textarea
   - Max 2000 characters
   - Resizable

3. **Category** (select)
   - Blog
   - Video
   - Social Media
   - Podcast
   - Newsletter
   - Other

4. **Status** (select)
   - Draft (default)
   - In Progress
   - Completed
   - Archived

5. **Priority** (select)
   - Low
   - Medium (default)
   - High

6. **Tags** (dynamic)
   - Add with button or Enter
   - Remove with X button
   - Displayed as chips

### Validation Rules
- Title: Required, not empty after trim
- Description: Optional
- Category/Status/Priority: Must be valid enum
- Tags: Array of strings

---

## 4. 🔍 IdeaDetail Component

### Mô tả
Modal hiển thị chi tiết đầy đủ của một ý tưởng.

### Features
- **Full Information**: Tất cả fields
- **Beautiful Layout**: Organized sections
- **User Info**: Creator name & email
- **Timestamps**: Created & Updated dates
- **Action Buttons**: Edit, Delete, Close
- **Responsive**: Works on all screens

### Layout

```
┌─────────────────────────────────┐
│ Chi tiết ý tưởng            [X] │
├─────────────────────────────────┤
│                                 │
│ ## TITLE (large)                │
│ [Nháp] [Cao] [Blog]            │
│                                 │
│ ┌─────────────────────────┐    │
│ │ Mô tả                   │    │
│ │ Full description text...│    │
│ │ (can be multiple lines) │    │
│ └─────────────────────────┘    │
│                                 │
│ 🏷️ Tags                         │
│ #tag1 #tag2 #tag3 #tag4        │
│                                 │
│ ────────────────────────────    │
│                                 │
│ 👤 Tạo bởi          📅 Thời gian│
│ John Doe            Tạo: ...   │
│ john@email.com      Update: ...│
│                                 │
│ [✏️ Sửa] [🗑️ Xóa] [Đóng]       │
└─────────────────────────────────┘
```

### Sections

1. **Header**: Title + status badges
2. **Description**: Full text in box
3. **Tags**: All tags as chips
4. **Metadata**: 2-column grid
   - Creator info (left)
   - Timestamps (right)
5. **Actions**: 3 buttons

---

## 5. 🔧 FilterBar Component

### Mô tả
Thanh lọc với 3 dropdowns và active filters display.

### Features
- **3 Dropdowns**: Status, Category, Priority
- **Active Count Badge**: Shows number of active filters
- **Clear All Button**: Reset all filters
- **Active Chips**: Display active filters with remove option
- **Responsive Grid**: Stacks on mobile

### Layout

```
┌─────────────────────────────────┐
│ 🔧 Bộ lọc (2)      [X Xóa]     │
├─────────────────────────────────┤
│                                 │
│ Trạng thái    Loại    Ưu tiên  │
│ [Draft ▼]   [Blog ▼] [High ▼]  │
│                                 │
│ ────────────────────────────    │
│                                 │
│ Đang lọc theo:                  │
│ [Status: draft x] [Priority: high x] │
└─────────────────────────────────┘
```

### Filter Options

**Status:**
- Tất cả
- Nháp
- Đang làm
- Hoàn thành
- Lưu trữ

**Category:**
- Tất cả
- Blog
- Video
- Social Media
- Podcast
- Newsletter
- Khác

**Priority:**
- Tất cả
- Cao
- Trung bình
- Thấp

### Active Filters Display
- Blue chips for status
- Purple chips for category
- Red chips for priority
- X button on each chip
- Clear all button at top

---

## 6. 🔍 SearchBar Component

### Mô tả
Search input với debounce và auto-search.

### Features
- **Debounced Search**: 500ms default delay
- **Loading Indicator**: Spinner while searching
- **Clear Button**: X to clear search
- **Submit on Enter**: Immediate search
- **Search Term Display**: Shows what you're searching

### Layout

```
┌─────────────────────────────────┐
│ 🔍 [Tìm kiếm ý tưởng...    ] X │
└─────────────────────────────────┘
     ↓
┌─────────────────────────────────┐
│ 🔍 Đang tìm kiếm: "react"       │
└─────────────────────────────────┘
```

### States

1. **Empty**: Search icon, placeholder
2. **Typing**: Text visible, clear button appears
3. **Loading**: Spinner replaces search icon
4. **With Results**: Display search term

### Behavior

1. User types → Start debounce timer
2. Timer expires → Trigger search
3. User presses Enter → Immediate search (skip timer)
4. Clear button → Reset input and search

---

## 7. 📊 StatsPanel Component

### Mô tả
Dashboard stats hiển thị tổng quan và breakdowns.

### Features
- **Total Count**: Large gradient card
- **3 Breakdowns**: Status, Priority, Category
- **Icons**: Visual indicators
- **Responsive Grid**: 1-3 columns based on screen
- **Animated Entrance**: Slide down animation

### Layout

```
┌─────────────────────────────────┐
│ 📊 Tổng số ý tưởng          ╱╲ │
│ 25                              │
└─────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│📈 Status │ │🎯 Prior. │ │📦 Categ. │
│          │ │          │ │          │
│ Nháp: 10 │ │ Cao: 8   │ │ Blog: 12 │
│ Làm: 8   │ │ TB: 10   │ │ Video: 8 │
│ Done: 7  │ │ Thấp: 7  │ │ SM: 5    │
└──────────┘ └──────────┘ └──────────┘
```

### Card Types

**1. Total Card (Large)**
- Gradient background (blue)
- Large number
- Icon (right side)
- White text

**2. Breakdown Cards (3x)**
- White background
- Icon + title
- List of items with counts
- Clean, minimal design

---

## 8. 🔐 ProtectedRoute Component

### Mô tả
Wrapper component bảo vệ routes yêu cầu authentication.

### Features
- **Auth Check**: Verify user logged in
- **Loading State**: Show loading while checking
- **Auto Redirect**: Navigate to login if not authenticated
- **Context Integration**: Uses AuthContext

### Flow

```
Route Access Attempt
       ↓
Check isLoading
    ↓     ↓
  YES    NO
    ↓     ↓
Loading  Check Auth
Screen      ↓     ↓
          YES    NO
           ↓     ↓
        Render  Redirect
        Child   to Login
```

### Usage
```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## 🎨 Design System

### Colors Palette

```css
/* Primary (Blue) */
50:  #f0f9ff
100: #e0f2fe
500: #0ea5e9  ← Main
600: #0284c7
700: #0369a1

/* Success (Green) */
100: #dcfce7
600: #16a34a
800: #166534

/* Warning (Yellow) */
100: #fef3c7
600: #d97706
800: #92400e

/* Danger (Red) */
100: #fee2e2
600: #dc2626
800: #991b1b

/* Gray */
50:  #f9fafb
100: #f3f4f6
600: #4b5563
900: #111827
```

### Typography

```css
/* Headings */
h1: 2xl font-bold
h2: xl font-bold
h3: lg font-semibold
h4: base font-semibold

/* Body */
text-sm: 0.875rem
text-base: 1rem
text-lg: 1.125rem

/* Weights */
font-medium: 500
font-semibold: 600
font-bold: 700
```

### Spacing Scale

```css
0.5: 2px
1:   4px
2:   8px
3:   12px
4:   16px
5:   20px
6:   24px
8:   32px
12:  48px
16:  64px
```

### Shadows

```css
shadow-sm:   0 1px 2px rgba(0,0,0,0.05)
shadow:      0 1px 3px rgba(0,0,0,0.1)
shadow-md:   0 4px 6px rgba(0,0,0,0.1)
shadow-lg:   0 10px 15px rgba(0,0,0,0.1)
shadow-xl:   0 20px 25px rgba(0,0,0,0.1)
shadow-2xl:  0 25px 50px rgba(0,0,0,0.25)
```

---

## 🎭 Animations

### CSS Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide Down */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Usage Classes

```tsx
// Fade in
<div className="animate-fadeIn">

// Slide up (modals)
<div className="animate-slideUp">

// Slide down (dropdowns)
<div className="animate-slideDown">

// Staggered (lists)
<div style={{ animationDelay: `${index * 50}ms` }}>
```

---

## 📱 Responsive Design

### Breakpoints

```css
sm:  640px  /* Small devices */
md:  768px  /* Medium devices */
lg:  1024px /* Large devices */
xl:  1280px /* Extra large */
2xl: 1536px /* 2X Extra large */
```

### Grid Layouts

**IdeaList Grid:**
```css
grid-cols-1        /* Mobile */
md:grid-cols-2     /* Tablet */
lg:grid-cols-3     /* Desktop */
```

**FilterBar:**
```css
grid-cols-1        /* Mobile - stacked */
sm:grid-cols-3     /* Tablet+ - 3 cols */
```

**StatsPanel:**
```css
grid-cols-1        /* Mobile */
md:grid-cols-3     /* Desktop - 3 cards */
```

---

## 🔄 Component Interactions

### Typical User Flow

```
1. User lands on Dashboard
   ↓
2. Views StatsPanel (toggle)
   ↓
3. Uses SearchBar to find ideas
   ↓
4. Applies filters via FilterBar
   ↓
5. Views results in IdeaList
   ↓
6. Clicks IdeaCard
   ↓
7. Opens IdeaDetail modal
   ↓
8. Clicks Edit button
   ↓
9. Opens IdeaForm modal
   ↓
10. Submits changes
    ↓
11. List refreshes
```

### Component Communication

```
DashboardV2
  ├─→ StatsPanel (stats data)
  ├─→ SearchBar (search callback)
  ├─→ FilterBar (filter callbacks)
  └─→ IdeaList (ideas array)
       └─→ IdeaCard (idea object)
            ├─→ IdeaDetail (onView)
            ├─→ IdeaForm (onEdit)
            └─→ Delete (onDelete)
```

---

## 🎯 Summary

### Total Components: 8
- ✅ 4 Major UI Components
- ✅ 3 Input/Filter Components
- ✅ 1 Utility Component

### Total Features: 50+
- Responsive design
- Animations
- Loading states
- Empty states
- Form validation
- Error handling
- Keyboard support
- Accessibility
- And more...

### Lines of Code: ~1,500
- TypeScript interfaces
- JSX components
- Tailwind classes
- Custom animations

---

**🎨 All components are production-ready!**

*See COMPONENTS-GUIDE.md for detailed API documentation*



