import { BarChart3, TrendingUp, Layers } from 'lucide-react';
import type { StatsData } from '../types';

interface StatsPanelProps {
  stats: StatsData;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const statusLabels = {
    'draft': 'Nháp',
    'in-progress': 'Đang làm',
    'completed': 'Hoàn thành',
    'archived': 'Lưu trữ',
  };

  const priorityLabels = {
    'low': 'Thấp',
    'medium': 'Trung bình',
    'high': 'Cao',
  };

  const categoryLabels = {
    'blog': 'Blog',
    'video': 'Video',
    'social-media': 'Social Media',
    'podcast': 'Podcast',
    'newsletter': 'Newsletter',
    'other': 'Khác',
  };

  return (
    <div className="mb-8">
      {/* Total Count */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium">Tổng số ý tưởng</p>
            <h2 className="text-4xl font-bold mt-1">{stats.total}</h2>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <BarChart3 className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* By Status */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Theo trạng thái</h3>
          </div>
          <div className="space-y-3">
            {stats.byStatus.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{statusLabels[item._id]}</span>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Priority */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Theo độ ưu tiên</h3>
          </div>
          <div className="space-y-3">
            {stats.byPriority.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{priorityLabels[item._id]}</span>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Category */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Theo loại</h3>
          </div>
          <div className="space-y-3">
            {stats.byCategory.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{categoryLabels[item._id]}</span>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



