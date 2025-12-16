import { Pen, Trash2, Calendar, Eye } from 'lucide-react';
import type { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onView?: (idea: Idea) => void;
  viewMode?: 'grid' | 'list';
}

export default function IdeaCard({ idea, onEdit, onDelete, onView, viewMode = 'grid' }: IdeaCardProps) {
  const statusColors = {
    draft: 'badge-draft',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed',
    archived: 'badge-archived',
  };

  const priorityColors = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
  };

  const categoryLabels = {
    'blog': 'Blog',
    'video': 'Video',
    'social-media': 'Social Media',
    'podcast': 'Podcast',
    'newsletter': 'Newsletter',
    'other': 'Khác',
  };

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

  const isListView = viewMode === 'list';

  return (
    <div className={`card hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer ${
      isListView ? 'flex items-center gap-4' : ''
    }`}>
      {/* Header */}
      <div className={`flex items-start justify-between ${isListView ? 'flex-1' : 'mb-3'}`}>
        <div className="flex-1" onClick={() => onView?.(idea)}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
            {idea.title}
          </h3>
        </div>
        <div className="flex gap-2 ml-2">
          {onView && (
            <button
              onClick={() => onView(idea)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Xem chi tiết"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(idea)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Pen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(idea._id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {idea.description && !isListView && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{idea.description}</p>
      )}

      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta Information */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`badge ${statusColors[idea.status]}`}>
          {statusLabels[idea.status]}
        </span>
        <span className={`badge ${priorityColors[idea.priority]}`}>
          {priorityLabels[idea.priority]}
        </span>
        <span className="badge bg-purple-100 text-purple-800">
          {categoryLabels[idea.category]}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(idea.createdAt).toLocaleDateString('vi-VN')}
      </div>
    </div>
  );
}

