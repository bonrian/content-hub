import { Filter, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import type { IdeaPriority, IdeaStatus } from '../types';

interface QuickFiltersProps {
  onPriorityFilter: (priority?: IdeaPriority) => void;
  onStatusFilter: (status?: IdeaStatus) => void;
  activePriority?: IdeaPriority;
  activeStatus?: IdeaStatus;
}

export default function QuickFilters({
  onPriorityFilter,
  onStatusFilter,
  activePriority,
  activeStatus,
}: QuickFiltersProps) {
  const priorityFilters = [
    { value: 'high' as IdeaPriority, label: 'Ưu tiên cao', icon: AlertCircle, color: 'red' },
    { value: 'medium' as IdeaPriority, label: 'Ưu tiên TB', icon: TrendingUp, color: 'yellow' },
    { value: 'low' as IdeaPriority, label: 'Ưu tiên thấp', icon: Filter, color: 'gray' },
  ];

  const statusFilters = [
    { value: 'draft' as IdeaStatus, label: 'Nháp', color: 'gray' },
    { value: 'in-progress' as IdeaStatus, label: 'Đang làm', color: 'blue' },
    { value: 'completed' as IdeaStatus, label: 'Hoàn thành', color: 'green' },
  ];

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Lọc nhanh</h3>
      </div>

      {/* Priority Filters */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Theo độ ưu tiên</p>
        <div className="flex flex-wrap gap-2">
          {priorityFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activePriority === filter.value;
            
            return (
              <button
                key={filter.value}
                onClick={() => onPriorityFilter(isActive ? undefined : filter.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? `bg-${filter.color}-100 text-${filter.color}-700 ring-2 ring-${filter.color}-500`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filters */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Theo trạng thái</p>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => {
            const isActive = activeStatus === filter.value;
            
            return (
              <button
                key={filter.value}
                onClick={() => onStatusFilter(isActive ? undefined : filter.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? `bg-${filter.color}-100 text-${filter.color}-700 ring-2 ring-${filter.color}-500`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {(activePriority || activeStatus) && (
        <button
          onClick={() => {
            onPriorityFilter(undefined);
            onStatusFilter(undefined);
          }}
          className="mt-4 w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  );
}



