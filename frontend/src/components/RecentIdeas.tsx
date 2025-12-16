import { Clock, TrendingUp, Eye } from 'lucide-react';
import type { Idea } from '../types';

interface RecentIdeasProps {
  ideas: Idea[];
  onView: (idea: Idea) => void;
}

export default function RecentIdeas({ ideas, onView }: RecentIdeasProps) {
  const recentIdeas = ideas.slice(0, 5); // Top 5 most recent

  const getStatusColor = (status: Idea['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      archived: 'bg-yellow-100 text-yellow-700',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Idea['priority']) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-yellow-500',
      high: 'text-red-500',
    };
    return colors[priority];
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const ideaDate = new Date(date);
    const diffInMs = now.getTime() - ideaDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return ideaDate.toLocaleDateString('vi-VN');
  };

  if (recentIdeas.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Ý tưởng mới nhất
        </h3>
        <div className="text-center py-8 text-gray-500">
          Chưa có ý tưởng nào
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Ý tưởng mới nhất
      </h3>
      <div className="space-y-3">
        {recentIdeas.map((idea, index) => (
          <div
            key={idea._id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
            onClick={() => onView(idea)}
          >
            {/* Number Badge */}
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                {idea.title}
              </h4>
              {idea.description && (
                <p className="text-sm text-gray-600 truncate mt-1">
                  {idea.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`badge text-xs ${getStatusColor(idea.status)}`}>
                  {idea.status}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <TrendingUp className={`w-3 h-3 ${getPriorityColor(idea.priority)}`} />
                  {idea.priority}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(idea.createdAt)}
                </span>
              </div>
            </div>

            {/* View Icon */}
            <button
              className="flex-shrink-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onView(idea);
              }}
            >
              <Eye className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}



