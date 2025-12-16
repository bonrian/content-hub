import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { StatsData } from '../../types';

interface CategoryChartProps {
  stats: StatsData;
}

const CATEGORY_LABELS = {
  'blog': 'Blog',
  'video': 'Video',
  'social-media': 'Social Media',
  'podcast': 'Podcast',
  'newsletter': 'Newsletter',
  'other': 'Khác',
};

const CATEGORY_COLORS = [
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Orange
  '#10b981', // Green
  '#3b82f6', // Blue
  '#6b7280', // Gray
];

export default function CategoryChart({ stats }: CategoryChartProps) {
  const data = stats.byCategory
    .map((item) => ({
      name: CATEGORY_LABELS[item._id as keyof typeof CATEGORY_LABELS] || item._id,
      count: item.count,
      id: item._id,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Phân bố theo Loại nội dung
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}



