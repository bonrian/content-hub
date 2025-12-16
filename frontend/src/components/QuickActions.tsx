import { useState } from 'react';
import { Check, Clock, Archive, MoreVertical } from 'lucide-react';
import type { Idea } from '../types';

interface QuickActionsProps {
  idea: Idea;
  onStatusChange: (status: Idea['status']) => void;
  onPriorityChange: (priority: Idea['priority']) => void;
}

/**
 * Quick action buttons for common operations
 * Provides instant feedback with optimistic updates
 */
export default function QuickActions({
  idea,
  onStatusChange,
  onPriorityChange,
}: QuickActionsProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusActions = [
    { value: 'in-progress', label: 'Bắt đầu làm', icon: Clock, color: 'blue' },
    { value: 'completed', label: 'Hoàn thành', icon: Check, color: 'green' },
    { value: 'archived', label: 'Lưu trữ', icon: Archive, color: 'yellow' },
  ] as const;

  const priorityActions = [
    { value: 'high', label: 'Cao', color: 'red' },
    { value: 'medium', label: 'Trung bình', color: 'yellow' },
    { value: 'low', label: 'Thấp', color: 'gray' },
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Quick actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20 animate-slideDown">
            {/* Status Actions */}
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Trạng thái
              </p>
              {statusActions.map((action) => {
                const Icon = action.icon;
                const isActive = idea.status === action.value;
                
                return (
                  <button
                    key={action.value}
                    onClick={() => {
                      onStatusChange(action.value);
                      setShowMenu(false);
                    }}
                    disabled={isActive}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 text-${action.color}-500`} />
                    {action.label}
                    {isActive && <Check className="w-3 h-3 ml-auto" />}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-gray-200 my-2" />

            {/* Priority Actions */}
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Ưu tiên
              </p>
              {priorityActions.map((action) => {
                const isActive = idea.priority === action.value;
                
                return (
                  <button
                    key={action.value}
                    onClick={() => {
                      onPriorityChange(action.value);
                      setShowMenu(false);
                    }}
                    disabled={isActive}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full bg-${action.color}-500`} />
                    {action.label}
                    {isActive && <Check className="w-3 h-3 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}



