import { useState } from 'react';
import { Grid, List, Loader } from 'lucide-react';
import IdeaCard from './IdeaCard';
import type { Idea } from '../types';

interface IdeaListProps {
  ideas: Idea[];
  isLoading: boolean;
  viewMode?: 'grid' | 'list';
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onView?: (idea: Idea) => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function IdeaList({
  ideas,
  isLoading,
  viewMode = 'grid',
  onEdit,
  onDelete,
  onView,
  onViewModeChange,
}: IdeaListProps) {
  const [localViewMode, setLocalViewMode] = useState<'grid' | 'list'>(viewMode);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setLocalViewMode(mode);
    onViewModeChange?.(mode);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p className="text-gray-600">Đang tải ý tưởng...</p>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Chưa có ý tưởng nào
        </h3>
        <p className="text-gray-600 mb-6">
          Bắt đầu bằng cách tạo ý tưởng đầu tiên của bạn
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold">{ideas.length}</span> ý tưởng
          </p>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded-md transition-all ${
                localViewMode === 'grid'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2 rounded-md transition-all ${
                localViewMode === 'list'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Ideas Grid/List */}
      <div
        className={
          localViewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {ideas.map((idea, index) => (
          <div
            key={idea._id}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <IdeaCard
              idea={idea}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              viewMode={localViewMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

