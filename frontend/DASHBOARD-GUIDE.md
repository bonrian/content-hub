# 📊 Dashboard Guide

Hướng dẫn sử dụng các Dashboard pages trong ứng dụng.

---

## 🎯 3 Dashboard Versions

### 1. Dashboard Overview (Landing Page) ⭐ RECOMMENDED
**Route:** `/` or `/overview`
**File:** `DashboardOverview.tsx`

**Features:**
- ✅ **Stats cards** - Total count + breakdowns
- ✅ **3 Beautiful charts** - Pie, Bar, Radar
- ✅ **Recent ideas list** - Top 5 newest
- ✅ **Quick filters** - Priority + Status buttons
- ✅ **Search bar** - With debounce
- ✅ **Create button** - Floating action button

**Best For:**
- Landing page
- Quick overview
- Executive summary
- Analytics view

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: Dashboard Tổng quan         │
├─────────────────────────────────────┤
│ [Total: 25] [Draft: 10] [Done: 8]  │ Stats
├─────────────────────────────────────┤
│ [Search bar]                        │
├─────────────────────────────────────┤
│ Quick Filters | Recent Ideas (5)    │
│               |                     │
├─────────────────────────────────────┤
│ 📊 Biểu đồ phân tích                │
│ [Pie Chart] [Bar Chart] [Radar]    │
└─────────────────────────────────────┘
```

---

### 2. Dashboard (Full Management) ⭐ BEST FOR WORK
**Route:** `/dashboard`
**File:** `DashboardOptimistic.tsx`

**Features:**
- ✅ **All ideas list** - Grid/List view
- ✅ **Advanced filters** - Status, Category, Priority
- ✅ **Search** - Full-text search
- ✅ **Pagination** - Navigate pages
- ✅ **CRUD operations** - Create, Edit, Delete
- ✅ **Optimistic updates** - Instant feedback
- ✅ **Stats panel** - Toggle on/off

**Best For:**
- Daily work
- Managing ideas
- CRUD operations
- Detailed view

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: Content Ideas Manager       │
├─────────────────────────────────────┤
│ [Stats Panel] (collapsible)         │
├─────────────────────────────────────┤
│ [Search bar]                        │
├─────────────────────────────────────┤
│ [Filter Bar: Status|Category|Prior] │
├─────────────────────────────────────┤
│ [Create Button]          [Grid/List]│
├─────────────────────────────────────┤
│ [Idea] [Idea] [Idea]                │ Grid
│ [Idea] [Idea] [Idea]                │
│ [Idea] [Idea] [Idea]                │
├─────────────────────────────────────┤
│ [< Prev] [1] [2] [3] [Next >]      │ Pagination
└─────────────────────────────────────┘
```

---

### 3. Dashboard V2 (Alternative)
**Route:** `/dashboard-v2`
**File:** `DashboardV2.tsx`

**Features:**
- Similar to DashboardOptimistic
- Without optimistic updates
- Traditional API flow

**Use Case:**
- Fallback version
- Testing without optimistic
- Comparison

---

## 📊 Charts Components

### 1. StatusChart (Pie Chart)

**File:** `components/charts/StatusChart.tsx`

**Type:** Pie Chart
**Library:** Recharts
**Data:** Breakdown by status (draft, in-progress, completed, archived)

**Features:**
- ✅ Percentage labels on slices
- ✅ Custom colors per status
- ✅ Interactive tooltip
- ✅ Legend at bottom
- ✅ Responsive

**Visual:**
```
     ┌───────────┐
   ┌─┘           └─┐
  │   Pie Chart    │
  │                │
  │  30%  40% 20%  │
  │                │
   └─┐         ┌─┘
     └─────────┘
   ● Draft ● In-Progress ● Completed
```

**Colors:**
- Draft: Gray (#9ca3af)
- In Progress: Blue (#3b82f6)
- Completed: Green (#10b981)
- Archived: Yellow (#f59e0b)

---

### 2. CategoryChart (Bar Chart)

**File:** `components/charts/CategoryChart.tsx`

**Type:** Vertical Bar Chart
**Library:** Recharts
**Data:** Breakdown by category (blog, video, social-media, etc.)

**Features:**
- ✅ Sorted by count (descending)
- ✅ Rounded bar tops
- ✅ Different color per bar
- ✅ Angled X-axis labels
- ✅ Grid background

**Visual:**
```
Count
  20 │     ███
  15 │     ███ ███
  10 │ ███ ███ ███ ███
   5 │ ███ ███ ███ ███ ███
   0 └──────────────────────
     Blog Vid  SM  Pod News
```

**Colors:**
- Blog: Purple
- Video: Pink
- Social Media: Orange
- Podcast: Green
- Newsletter: Blue
- Other: Gray

---

### 3. PriorityChart (Radar Chart)

**File:** `components/charts/PriorityChart.tsx`

**Type:** Radar/Spider Chart
**Library:** Recharts
**Data:** Breakdown by priority (high, medium, low)

**Features:**
- ✅ Radar visualization
- ✅ Purple theme
- ✅ Grid lines
- ✅ Filled area
- ✅ Interactive

**Visual:**
```
        Cao
         ╱│╲
        ╱ │ ╲
       ╱  │  ╲
    TB────┼────Thấp
       ╲  │  ╱
        ╲ │ ╱
         ╲│╱
```

**Color:** Purple (#8b5cf6)

---

## 🔥 RecentIdeas Component

**File:** `components/RecentIdeas.tsx`

**Features:**
- ✅ Shows top 5 newest ideas
- ✅ Number badges (1, 2, 3, 4, 5)
- ✅ Status + priority indicators
- ✅ Relative time display ("2 giờ trước", "Hôm qua")
- ✅ Click to view detail
- ✅ Hover effects

**Layout:**
```
┌────────────────────────────────┐
│ 🕐 Ý tưởng mới nhất            │
├────────────────────────────────┤
│ [1] Title 1           [Draft]  │
│     Description...    2h ago   │
├────────────────────────────────┤
│ [2] Title 2           [Done]   │
│     Description...    1 day    │
├────────────────────────────────┤
│ [3] Title 3           [InProg] │
│     ...                        │
└────────────────────────────────┘
```

**Time Formatting:**
- < 1 hour: "Vừa xong"
- < 24 hours: "X giờ trước"
- 1 day: "Hôm qua"
- < 7 days: "X ngày trước"
- Older: Full date

---

## ⚡ QuickFilters Component

**File:** `components/QuickFilters.tsx`

**Features:**
- ✅ Priority buttons (High, Medium, Low)
- ✅ Status buttons (Draft, In-Progress, Completed)
- ✅ Toggle on/off (click again to clear)
- ✅ Active state with ring
- ✅ Icons for visual clarity

**Layout:**
```
┌────────────────────────────────┐
│ ⚡ Lọc nhanh                    │
├────────────────────────────────┤
│ Theo độ ưu tiên:               │
│ [🔴 Cao] [🟡 TB] [⚪ Thấp]     │
│                                │
│ Theo trạng thái:               │
│ [Nháp] [Đang làm] [Hoàn thành]│
│                                │
│ [Xóa tất cả bộ lọc]           │
└────────────────────────────────┘
```

**Active State:**
- Ring around button
- Darker color
- Icon highlighted

---

## 🎨 Dashboard Comparison

| Feature | Overview | Full Management |
|---------|----------|-----------------|
| **Charts** | ✅ 3 charts | ❌ Stats cards only |
| **Recent Ideas** | ✅ Top 5 | ❌ |
| **Quick Filters** | ✅ Buttons | ❌ |
| **Full List** | ❌ | ✅ All ideas |
| **Pagination** | ❌ | ✅ Full pagination |
| **View Modes** | ❌ | ✅ Grid/List |
| **Advanced Filters** | ❌ | ✅ Dropdowns |
| **Search** | ✅ Basic | ✅ Advanced |
| **Best For** | Overview | Daily work |

---

## 🗺️ Navigation Flow

```
Login/Register
    ↓
Dashboard Overview (/)
    │
    ├─→ View all ideas
    │   → Dashboard (/dashboard)
    │       └─→ CRUD operations
    │
    ├─→ Click recent idea
    │   → Idea Detail Modal
    │       └─→ Edit/Delete
    │
    └─→ Quick filter
        → Filtered view
```

---

## 📊 Chart Details

### StatusChart (Pie Chart)

**Data Structure:**
```typescript
[
  { name: 'Nháp', value: 10 },
  { name: 'Đang làm', value: 8 },
  { name: 'Hoàn thành', value: 7 }
]
```

**Configuration:**
- Size: 300px height
- Label: Percentage inside slices
- Tooltip: Shows name + value
- Legend: Bottom, with colors

---

### CategoryChart (Bar Chart)

**Data Structure:**
```typescript
[
  { name: 'Blog', count: 12 },
  { name: 'Video', count: 8 },
  { name: 'Social Media', count: 5 }
]
```

**Configuration:**
- Size: 300px height
- Bars: Rounded tops (radius: 8)
- X-axis: Angled labels (-45°)
- Grid: Dashed lines
- Colors: Different per bar

---

### PriorityChart (Radar Chart)

**Data Structure:**
```typescript
[
  { priority: 'Cao', count: 10 },
  { priority: 'Trung bình', count: 10 },
  { priority: 'Thấp', count: 5 }
]
```

**Configuration:**
- Size: 300px height
- Fill: Purple (#8b5cf6)
- Opacity: 0.6
- Grid: Polar grid

---

## 🎯 Usage Guide

### Landing on Overview

1. User logs in
2. Lands on Dashboard Overview
3. Sees:
   - Total stats
   - Charts
   - Recent ideas
   - Quick filters

### Navigating to Full List

1. Click "Danh sách đầy đủ"
2. Go to `/dashboard`
3. See all ideas with full controls

### Quick Actions

1. Use quick filter buttons
2. Instant filtering
3. See filtered charts
4. Click recent idea to view

---

## 💡 Use Cases

### Executive/Manager View
→ Use **Dashboard Overview**
- High-level stats
- Visual charts
- Quick insights

### Content Creator View
→ Use **Full Dashboard**
- All ideas accessible
- CRUD operations
- Detailed management

### Quick Check
→ Use **Dashboard Overview**
- Recent updates
- Priority items
- Status at a glance

---

## 🚀 Performance

### Chart Rendering
- Recharts: ~50ms render time
- Responsive: Auto-resize
- Smooth: 60fps animations

### Data Loading
- Stats: Cached (1 min)
- Ideas: Optimistic updates
- Charts: Re-render on data change

---

## 🎨 Customization

### Chart Colors

Edit in chart components:
```typescript
// StatusChart.tsx
const STATUS_COLORS = {
  draft: '#9ca3af',
  'in-progress': '#3b82f6',
  // ... customize
};
```

### Chart Types

Can replace with:
- Line charts (trends over time)
- Donut charts (instead of pie)
- Area charts (stacked data)
- Mixed charts (combination)

---

## 📱 Responsive

### Desktop (> 1024px)
```
┌──────────────────────────┐
│ Stats (1 row x 4 cards)  │
│ Search                   │
│ [Quick] [Recent Ideas]   │
│ [Chart] [Chart] [Chart]  │
└──────────────────────────┘
```

### Tablet (640-1024px)
```
┌──────────────────────────┐
│ Stats (2 rows x 2 cards) │
│ Search                   │
│ Quick Filters            │
│ Recent Ideas             │
│ [Chart] [Chart]          │
│ [Chart]                  │
└──────────────────────────┘
```

### Mobile (< 640px)
```
┌──────────────────────────┐
│ Stats (stacked)          │
│ Search                   │
│ Quick Filters            │
│ Recent Ideas             │
│ [Chart]                  │
│ [Chart]                  │
│ [Chart]                  │
│ [FAB +]                  │
└──────────────────────────┘
```

---

## 🧪 Testing Checklist

### Charts
- [ ] Pie chart renders
- [ ] Bar chart renders
- [ ] Radar chart renders
- [ ] Tooltips work
- [ ] Legend shows
- [ ] Responsive on resize

### Recent Ideas
- [ ] Shows top 5
- [ ] Sorted by date
- [ ] Click to view works
- [ ] Time formatting correct
- [ ] Badges show correctly

### Quick Filters
- [ ] Priority buttons work
- [ ] Status buttons work
- [ ] Toggle on/off works
- [ ] Clear all works
- [ ] Active state shows

### Integration
- [ ] Stats load correctly
- [ ] Charts update on data change
- [ ] Search filters work
- [ ] Navigation to full list works
- [ ] Create button works

---

## 📚 Documentation

**Files:**
- `DASHBOARD-GUIDE.md` - This file
- `COMPONENTS-GUIDE.md` - All components
- `API-INTEGRATION.md` - API integration
- `README.md` - Main docs

---

**📊 Beautiful dashboards ready to use!**



