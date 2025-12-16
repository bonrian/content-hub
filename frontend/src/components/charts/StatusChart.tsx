import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { StatsData } from '../../types';

interface StatusChartProps {
  stats: StatsData;
}

const STATUS_COLORS = {
  draft: '#9ca3af',      // Gray
  'in-progress': '#3b82f6', // Blue
  completed: '#10b981',  // Green
  archived: '#f59e0b',   // Yellow
};

const STATUS_LABELS = {
  draft: 'Nháp',
  'in-progress': 'Đang làm',
  completed: 'Hoàn thành',
  archived: 'Lưu trữ',
};

export default function StatusChart({ stats }: StatusChartProps) {
  const data = stats.byStatus.map((item) => ({
    name: STATUS_LABELS[item._id as keyof typeof STATUS_LABELS] || item._id,
    value: item.count,
    id: item._id,
  }));

  const COLORS = stats.byStatus.map(
    (item) => STATUS_COLORS[item._id as keyof typeof STATUS_COLORS] || '#6b7280'
  );

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Phân bố theo Trạng thái
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}



