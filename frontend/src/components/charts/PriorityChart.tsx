import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { StatsData } from '../../types';

interface PriorityChartProps {
  stats: StatsData;
}

const PRIORITY_LABELS = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

export default function PriorityChart({ stats }: PriorityChartProps) {
  const data = stats.byPriority.map((item) => ({
    priority: PRIORITY_LABELS[item._id as keyof typeof PRIORITY_LABELS] || item._id,
    count: item.count,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Phân bố theo Độ ưu tiên
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="priority" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fontSize: 12 }} />
          <Radar
            name="Số lượng"
            dataKey="count"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}



