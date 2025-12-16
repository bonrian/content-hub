import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Search, Filter, TrendingUp, List, Grid } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIdeas, useStats } from '../hooks/useIdeas';
import IdeaCard from '../components/IdeaCard';
import IdeaForm from '../components/IdeaForm';
import StatsPanel from '../components/StatsPanel';
import type { Idea, IdeaFilters, IdeaFormData } from '../types';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<IdeaFilters>({
    page: 1,
    limit: 12,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { ideas, isLoading, pagination, createIdea, updateIdea, deleteIdea } = useIdeas(filters);
  const { stats } = useStats();

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleCreateIdea = async (data: IdeaFormData) => {
    await createIdea(data);
  };

  const handleEditIdea = async (data: IdeaFormData) => {
    if (editingIdea) {
      await updateIdea(editingIdea._id, data);
    }
  };

  const handleDeleteIdea = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ý tưởng này?')) {
      await deleteIdea(id);
    }
  };

  const openEditForm = (idea: Idea) => {
    setEditingIdea(idea);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingIdea(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Ideas Manager</h1>
              <p className="text-sm text-gray-600">Xin chào, {user?.name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Thống kê</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-secondary flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Panel */}
        {showStats && stats && <StatsPanel stats={stats} />}

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* Search and Create */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Tìm kiếm ý tưởng..."
                className="input flex-1"
              />
              <button onClick={handleSearch} className="btn btn-secondary">
                <Search className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tạo ý tưởng mới
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-gray-500" />
            
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="draft">Nháp</option>
              <option value="in-progress">Đang làm</option>
              <option value="completed">Hoàn thành</option>
              <option value="archived">Lưu trữ</option>
            </select>

            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tất cả loại</option>
              <option value="blog">Blog</option>
              <option value="video">Video</option>
              <option value="social-media">Social Media</option>
              <option value="podcast">Podcast</option>
              <option value="newsletter">Newsletter</option>
              <option value="other">Khác</option>
            </select>

            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tất cả ưu tiên</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Ideas Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Chưa có ý tưởng nào</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tạo ý tưởng đầu tiên
            </button>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'flex flex-col gap-4'
            }>
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea._id}
                  idea={idea}
                  onEdit={openEditForm}
                  onDelete={handleDeleteIdea}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                  disabled={(filters.page || 1) <= 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Trang {filters.page || 1} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                  disabled={(filters.page || 1) >= pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Idea Form Modal */}
      {isFormOpen && (
        <IdeaForm
          idea={editingIdea}
          onSubmit={editingIdea ? handleEditIdea : handleCreateIdea}
          onClose={closeForm}
        />
      )}
    </div>
  );
}



