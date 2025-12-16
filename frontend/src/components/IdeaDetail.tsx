import { X, Calendar, User, Pen, Trash2, Tag } from 'lucide-react';
import type { Idea } from '../types';

interface IdeaDetailProps {
  idea: Idea;
  onClose: () => void;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
}

export default function IdeaDetail({ idea, onClose, onEdit, onDelete }: IdeaDetailProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    archived: 'bg-yellow-100 text-yellow-800',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-600',
    high: 'bg-red-100 text-red-600',
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

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ý tưởng này?')) {
      onDelete(idea._id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết ý tưởng</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{idea.title}</h3>
            <div className="flex flex-wrap gap-2">
              <span className={`badge ${statusColors[idea.status]}`}>
                {statusLabels[idea.status]}
              </span>
              <span className={`badge ${priorityColors[idea.priority]}`}>
                Ưu tiên: {priorityLabels[idea.priority]}
              </span>
              <span className="badge bg-purple-100 text-purple-800">
                {categoryLabels[idea.category]}
              </span>
            </div>
          </div>

          {/* Description */}
          {idea.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Mô tả</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {idea.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-600" />
                <h4 className="text-sm font-semibold text-gray-700">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {/* Created By */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tạo bởi</p>
                <p className="text-sm font-medium text-gray-900">{idea.user.name}</p>
                <p className="text-xs text-gray-500">{idea.user.email}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Thời gian</p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Tạo:</span>{' '}
                  {new Date(idea.createdAt).toLocaleString('vi-VN')}
                </p>
                {idea.updatedAt !== idea.createdAt && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Cập nhật:</span>{' '}
                    {new Date(idea.updatedAt).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                onEdit(idea);
                onClose();
              }}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Pen className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger flex-1 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary px-6"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



