import { useState, useEffect, FormEvent } from 'react';
import { X, Save, Loader, Sparkles, Wand2 } from 'lucide-react';
import type { Idea, IdeaFormData, IdeaCategory, IdeaStatus, IdeaPriority } from '../types';
import AIGenerator from './AIGenerator';

interface IdeaFormProps {
  idea?: Idea | null;
  onSubmit: (data: IdeaFormData) => Promise<void>;
  onClose: () => void;
}

export default function IdeaForm({ idea, onSubmit, onClose }: IdeaFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    category: 'other',
    status: 'draft',
    priority: 'medium',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiMode, setAIMode] = useState<'generate' | 'improve'>('generate');

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title,
        description: idea.description || '',
        category: idea.category,
        status: idea.status,
        priority: idea.priority,
        tags: idea.tags || [],
      });
    }
  }, [idea]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAIApply = (data: { title?: string; description?: string; tags?: string[] }) => {
    setFormData({
      ...formData,
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.tags && { tags: [...formData.tags, ...data.tags.filter(t => !formData.tags.includes(t))] })
    });
  };

  const openAIGenerator = (mode: 'generate' | 'improve') => {
    setAIMode(mode);
    setShowAIGenerator(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {idea ? 'Chỉnh sửa ý tưởng' : 'Tạo ý tưởng mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* AI Quick Actions */}
          <div className="flex gap-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <button
              type="button"
              onClick={() => openAIGenerator('generate')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
            >
              <Wand2 className="w-4 h-4" />
              Tạo với AI
            </button>
            {(formData.title || formData.description) && (
              <button
                type="button"
                onClick={() => openAIGenerator('improve')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-purple-600 border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-all font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Cải thiện
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Ví dụ: Viết blog về AI"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[100px] resize-y"
              placeholder="Mô tả chi tiết về ý tưởng..."
              rows={4}
            />
          </div>

          {/* Category, Status, Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Loại
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as IdeaCategory })}
                className="input"
              >
                <option value="blog">Blog</option>
                <option value="video">Video</option>
                <option value="social-media">Social Media</option>
                <option value="podcast">Podcast</option>
                <option value="newsletter">Newsletter</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as IdeaStatus })}
                className="input"
              >
                <option value="draft">Nháp</option>
                <option value="in-progress">Đang làm</option>
                <option value="completed">Hoàn thành</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Độ ưu tiên
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as IdeaPriority })}
                className="input"
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input"
                placeholder="Nhập tag và Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn btn-secondary whitespace-nowrap"
              >
                Thêm
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {idea ? 'Cập nhật' : 'Tạo mới'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      {/* AI Generator Modal */}
      <AIGenerator
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        mode={aiMode}
        currentTitle={formData.title}
        currentDescription={formData.description}
        category={formData.category}
        onApply={handleAIApply}
      />
    </div>
  );
}


