import { Filter, X } from 'lucide-react';
import type { IdeaCategory, IdeaStatus, IdeaPriority } from '../types';

interface FilterBarProps {
  status?: IdeaStatus;
  category?: IdeaCategory;
  priority?: IdeaPriority;
  onStatusChange: (status?: IdeaStatus) => void;
  onCategoryChange: (category?: IdeaCategory) => void;
  onPriorityChange: (priority?: IdeaPriority) => void;
  onClearFilters: () => void;
}

export default function FilterBar({
  status,
  category,
  priority,
  onStatusChange,
  onCategoryChange,
  onPriorityChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = status || category || priority;

  const activeFiltersCount = [status, category, priority].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-600 text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={status || ''}
            onChange={(e) => onStatusChange(e.target.value as IdeaStatus || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Tất cả</option>
            <option value="draft">Nháp</option>
            <option value="in-progress">Đang làm</option>
            <option value="completed">Hoàn thành</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại nội dung
          </label>
          <select
            value={category || ''}
            onChange={(e) => onCategoryChange(e.target.value as IdeaCategory || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Tất cả</option>
            <option value="blog">Blog</option>
            <option value="video">Video</option>
            <option value="social-media">Social Media</option>
            <option value="podcast">Podcast</option>
            <option value="newsletter">Newsletter</option>
            <option value="other">Khác</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Độ ưu tiên
          </label>
          <select
            value={priority || ''}
            onChange={(e) => onPriorityChange(e.target.value as IdeaPriority || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Tất cả</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Đang lọc theo:</p>
          <div className="flex flex-wrap gap-2">
            {status && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Trạng thái: {status}
                <button
                  onClick={() => onStatusChange(undefined)}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                Loại: {category}
                <button
                  onClick={() => onCategoryChange(undefined)}
                  className="hover:text-purple-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priority && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                Ưu tiên: {priority}
                <button
                  onClick={() => onPriorityChange(undefined)}
                  className="hover:text-red-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



