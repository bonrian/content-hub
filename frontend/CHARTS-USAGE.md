# 📊 Charts Usage Guide

Complete guide to using charts in the Content Ideas Manager application.

---

## 🎯 Overview

The application uses **Recharts** library to display beautiful, interactive charts showing analytics about your content ideas.

**3 Chart Types:**
1. **Pie Chart** - Status distribution
2. **Bar Chart** - Category breakdown  
3. **Radar Chart** - Priority analysis

---

## 📦 Installation

Recharts is already included in `package.json`:

```json
{
  "dependencies": {
    "recharts": "^2.10.3"
  }
}
```

**Install:**
```bash
npm install
```

---

## 📊 Chart Components

### 1. StatusChart (Pie Chart)

**Location:** `src/components/charts/StatusChart.tsx`

**Purpose:** Shows distribution of ideas by status (draft, in-progress, completed, archived)

**Props:**
```typescript
interface StatusChartProps {
  stats: StatsData;  // Statistics data from API
}
```

**Usage:**
```tsx
import StatusChart from './components/charts/StatusChart';

function Dashboard() {
  const { stats } = useStatsWithCache();
  
  return (
    <StatusChart stats={stats} />
  );
}
```

**Data Format:**
```typescript
stats = {
  byStatus: [
    { _id: 'draft', count: 10 },
    { _id: 'in-progress', count: 8 },
    { _id: 'completed', count: 7 },
    { _id: 'archived', count: 2 }
  ]
}
```

**Visual:**
```
     ┌───────────┐
   ┌─┘  Pie     └─┐
  │   Chart       │
  │  37% 30% 26%  │
  │      7%       │
   └─┐         ┌─┘
     └─────────┘
```

**Features:**
- ✅ Percentage labels on slices
- ✅ Custom colors per status
- ✅ Interactive tooltip
- ✅ Legend at bottom
- ✅ Responsive (300px height)

**Colors:**
- Draft: Gray (#9ca3af)
- In Progress: Blue (#3b82f6)
- Completed: Green (#10b981)
- Archived: Yellow (#f59e0b)

---

### 2. CategoryChart (Bar Chart)

**Location:** `src/components/charts/CategoryChart.tsx`

**Purpose:** Shows breakdown of ideas by category (blog, video, social-media, etc.)

**Props:**
```typescript
interface CategoryChartProps {
  stats: StatsData;  // Statistics data from API
}
```

**Usage:**
```tsx
import CategoryChart from './components/charts/CategoryChart';

function Dashboard() {
  const { stats } = useStatsWithCache();
  
  return (
    <CategoryChart stats={stats} />
  );
}
```

**Data Format:**
```typescript
stats = {
  byCategory: [
    { _id: 'blog', count: 12 },
    { _id: 'video', count: 8 },
    { _id: 'social-media', count: 5 },
    { _id: 'podcast', count: 3 },
    { _id: 'newsletter', count: 2 },
    { _id: 'other', count: 1 }
  ]
}
```

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

**Features:**
- ✅ Sorted by count (descending)
- ✅ Rounded bar tops (radius: 8)
- ✅ Different color per bar
- ✅ Angled X-axis labels (-45°)
- ✅ Grid background
- ✅ Responsive (300px height)

**Colors:**
- Blog: Purple (#8b5cf6)
- Video: Pink (#ec4899)
- Social Media: Orange (#f59e0b)
- Podcast: Green (#10b981)
- Newsletter: Blue (#3b82f6)
- Other: Gray (#6b7280)

---

### 3. PriorityChart (Radar Chart)

**Location:** `src/components/charts/PriorityChart.tsx`

**Purpose:** Shows distribution of ideas by priority (high, medium, low)

**Props:**
```typescript
interface PriorityChartProps {
  stats: StatsData;  // Statistics data from API
}
```

**Usage:**
```tsx
import PriorityChart from './components/charts/PriorityChart';

function Dashboard() {
  const { stats } = useStatsWithCache();
  
  return (
    <PriorityChart stats={stats} />
  );
}
```

**Data Format:**
```typescript
stats = {
  byPriority: [
    { _id: 'high', count: 10 },
    { _id: 'medium', count: 10 },
    { _id: 'low', count: 5 }
  ]
}
```

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

**Features:**
- ✅ Radar/spider visualization
- ✅ Purple theme (#8b5cf6)
- ✅ Grid lines
- ✅ Filled area (opacity: 0.6)
- ✅ Interactive tooltip
- ✅ Responsive (300px height)

**Color:** Purple (#8b5cf6)

---

## 🎨 Customization

### Changing Colors

**StatusChart:**
```typescript
// In StatusChart.tsx
const STATUS_COLORS = {
  draft: '#9ca3af',      // Change to your color
  'in-progress': '#3b82f6',
  completed: '#10b981',
  archived: '#f59e0b',
};
```

**CategoryChart:**
```typescript
// In CategoryChart.tsx
const CATEGORY_COLORS = [
  '#8b5cf6', // Purple - Change these
  '#ec4899', // Pink
  '#f59e0b', // Orange
  '#10b981', // Green
  '#3b82f6', // Blue
  '#6b7280', // Gray
];
```

**PriorityChart:**
```typescript
// In PriorityChart.tsx
<Radar
  stroke="#8b5cf6"  // Change stroke color
  fill="#8b5cf6"    // Change fill color
  fillOpacity={0.6}  // Change opacity
/>
```

---

### Changing Size

All charts use `ResponsiveContainer` with `height={300}`:

```typescript
<ResponsiveContainer width="100%" height={300}>
  {/* Chart here */}
</ResponsiveContainer>
```

**To change:**
```typescript
<ResponsiveContainer width="100%" height={400}>
  {/* Taller chart */}
</ResponsiveContainer>
```

---

### Changing Labels

**StatusChart:**
```typescript
const STATUS_LABELS = {
  draft: 'Nháp',           // Change labels
  'in-progress': 'Đang làm',
  completed: 'Hoàn thành',
  archived: 'Lưu trữ',
};
```

**CategoryChart:**
```typescript
const CATEGORY_LABELS = {
  'blog': 'Blog',          // Change labels
  'video': 'Video',
  'social-media': 'Social Media',
  'podcast': 'Podcast',
  'newsletter': 'Newsletter',
  'other': 'Khác',
};
```

**PriorityChart:**
```typescript
const PRIORITY_LABELS = {
  high: 'Cao',             // Change labels
  medium: 'Trung bình',
  low: 'Thấp',
};
```

---

## 📊 Complete Example

### DashboardOverview.tsx

```tsx
import { useState } from 'react';
import { useStatsWithCache } from '../hooks/useIdeasOptimistic';
import StatusChart from '../components/charts/StatusChart';
import CategoryChart from '../components/charts/CategoryChart';
import PriorityChart from '../components/charts/PriorityChart';

export default function DashboardOverview() {
  const { stats, isLoading } = useStatsWithCache();

  if (isLoading) {
    return <div>Loading charts...</div>;
  }

  if (!stats) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <StatusChart stats={stats} />
        
        {/* Bar Chart */}
        <CategoryChart stats={stats} />
        
        {/* Radar Chart */}
        <PriorityChart stats={stats} />
      </div>
    </div>
  );
}
```

---

## 🔧 Advanced Customization

### Adding More Charts

**Line Chart (Trend over time):**
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#8b5cf6" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**Area Chart:**
```tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AreaChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

---

## 🎯 Best Practices

### 1. Loading States

Always show loading state while fetching data:

```tsx
if (isLoading) {
  return (
    <div className="card">
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
```

### 2. Empty States

Handle cases with no data:

```tsx
if (!stats || stats.byStatus.length === 0) {
  return (
    <div className="card">
      <p className="text-gray-500">Chưa có dữ liệu</p>
    </div>
  );
}
```

### 3. Responsive Design

Use responsive grid:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <StatusChart stats={stats} />
  <CategoryChart stats={stats} />
  <PriorityChart stats={stats} />
</div>
```

### 4. Error Handling

Wrap charts in error boundaries:

```tsx
try {
  return <StatusChart stats={stats} />;
} catch (error) {
  console.error('Chart error:', error);
  return <div>Error rendering chart</div>;
}
```

---

## 🐛 Troubleshooting

### Chart not rendering?

**Check:**
1. Data is available: `console.log(stats)`
2. Container has dimensions: Add `min-height` or `height`
3. Recharts installed: `npm list recharts`
4. No console errors: Check browser console

**Debug:**
```tsx
console.log('Stats:', stats);
console.log('Chart data:', data);
```

### TypeScript errors?

**Install types:**
```bash
npm install --save-dev @types/recharts
```

### Chart too small?

**Increase container height:**
```tsx
<ResponsiveContainer width="100%" height={400}>
  {/* Chart */}
</ResponsiveContainer>
```

### Colors not showing?

**Check Tailwind config:**
```js
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

---

## 📚 Recharts Documentation

**Official Docs:** https://recharts.org/

**Useful Links:**
- [Pie Chart Examples](https://recharts.org/en-US/examples/TwoLevelPieChart)
- [Bar Chart Examples](https://recharts.org/en-US/examples/SimpleBarChart)
- [Radar Chart Examples](https://recharts.org/en-US/examples/SimpleRadarChart)
- [API Reference](https://recharts.org/en-US/api)

---

## 🎨 Chart Styling

### Card Wrapper

All charts use the same card wrapper:

```tsx
<div className="card">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">
    Chart Title
  </h3>
  <ResponsiveContainer width="100%" height={300}>
    {/* Chart here */}
  </ResponsiveContainer>
</div>
```

**Card class (in index.css):**
```css
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
```

### Tooltip Styling

All charts use consistent tooltip styling:

```tsx
<Tooltip
  contentStyle={{
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '8px 12px',
  }}
/>
```

---

## 🚀 Performance

### Bundle Size

Recharts adds ~95KB gzipped to your bundle.

**Optimize:**
- Import specific components (we already do this)
- Use code splitting
- Enable production build

### Render Performance

Charts render in ~50-100ms.

**Optimize:**
- Memoize chart data
- Use `React.memo` for chart components
- Limit data points (< 100 for smooth)

**Example:**
```tsx
import { memo } from 'react';

const StatusChart = memo(({ stats }) => {
  // Chart code
});

export default StatusChart;
```

---

## 🎯 Use Cases

### Executive Dashboard
Show all 3 charts side by side:
```tsx
<div className="grid grid-cols-3 gap-6">
  <StatusChart stats={stats} />
  <CategoryChart stats={stats} />
  <PriorityChart stats={stats} />
</div>
```

### Mobile View
Stack charts vertically:
```tsx
<div className="grid grid-cols-1 gap-6">
  <StatusChart stats={stats} />
  <CategoryChart stats={stats} />
  <PriorityChart stats={stats} />
</div>
```

### Printable Report
Use larger charts:
```tsx
<ResponsiveContainer width="100%" height={500}>
  {/* Chart */}
</ResponsiveContainer>
```

---

## 📊 Data Flow

```
Backend API (/api/ideas/stats)
    ↓
Frontend Service (api.ts)
    ↓
Custom Hook (useStatsWithCache)
    ↓
Dashboard Component
    ↓
Chart Components (StatusChart, CategoryChart, PriorityChart)
    ↓
Recharts Library
    ↓
SVG Rendering
```

---

## ✅ Checklist

Before deploying charts:

- [ ] Recharts installed
- [ ] All 3 charts render correctly
- [ ] Data loads from API
- [ ] Loading states work
- [ ] Empty states handled
- [ ] Responsive on mobile
- [ ] Colors match design
- [ ] Tooltips work
- [ ] No console errors
- [ ] Performance is good

---

## 🎉 Summary

You now have:
- ✅ 3 beautiful charts
- ✅ Pie, Bar, and Radar types
- ✅ Interactive tooltips
- ✅ Responsive design
- ✅ Custom colors
- ✅ Production ready

**Enjoy your analytics dashboard! 📊**

---

**Need help?** Check:
- [Recharts Docs](https://recharts.org/)
- [Dashboard Guide](DASHBOARD-GUIDE.md)
- [Components Guide](COMPONENTS-GUIDE.md)



