import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIdeas, useStats } from '../hooks/useIdeas';
import IdeaList from '../components/IdeaList';
import IdeaForm from '../components/IdeaForm';
import IdeaDetail from '../components/IdeaDetail';
import StatsPanel from '../components/StatsPanel';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import type { Idea, IdeaFilters, IdeaFormData } from '../types';

export default function DashboardV2() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<IdeaFilters>({
    page: 1,
    limit: 12,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [viewingIdea, setViewingIdea] = useState<Idea | null>(null);
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { ideas, isLoading, pagination, createIdea, updateIdea, deleteIdea } = useIdeas(filters);
  const { stats } = useStats();

  // Handler functions
  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query || undefined, page: 1 });
  };

  const handleStatusChange = (status: any) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handleCategoryChange = (category: any) => {
    setFilters({ ...filters, category, page: 1 });
  };

  const handlePriorityChange = (priority: any) => {
    setFilters({ ...filters, priority, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 12 });
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

  const openCreateForm = () => {
    setEditingIdea(null);
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

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Content Ideas Manager
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Xin chào, <span className="font-semibold">{user?.name}</span>! 👋
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {showStats ? 'Ẩn' : 'Hiện'} thống kê
                </span>
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
        {showStats && stats && (
          <div className="animate-slideDown">
            <StatsPanel stats={stats} />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
            isLoading={isLoading}
          />
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            status={filters.status}
            category={filters.category}
            priority={filters.priority}
            onStatusChange={handleStatusChange}
            onCategoryChange={handleCategoryChange}
            onPriorityChange={handlePriorityChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Create Button - Sticky on mobile */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {filters.search ? 'Kết quả tìm kiếm' : 'Danh sách ý tưởng'}
          </h2>
          <button
            onClick={openCreateForm}
            className="btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tạo ý tưởng mới</span>
            <span className="sm:hidden">Tạo mới</span>
          </button>
        </div>

        {/* Ideas List */}
        <IdeaList
          ideas={ideas}
          isLoading={isLoading}
          viewMode={viewMode}
          onEdit={openEditForm}
          onDelete={handleDeleteIdea}
          onViewModeChange={setViewMode}
        />

        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              ← Trước
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                const isCurrentPage = page === pagination.currentPage;
                
                // Show first page, last page, current page, and pages around current
                const showPage = 
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.currentPage) <= 1;
                
                if (!showPage) {
                  // Show ellipsis
                  if (page === 2 || page === pagination.totalPages - 1) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isCurrentPage
                        ? 'bg-primary-600 text-white font-semibold'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Sau →
            </button>
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && ideas.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Hiển thị {(pagination.currentPage - 1) * (filters.limit || 12) + 1} -{' '}
            {Math.min(pagination.currentPage * (filters.limit || 12), pagination.total)} trong tổng số{' '}
            <span className="font-semibold">{pagination.total}</span> ý tưởng
          </div>
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

      {/* Idea Detail Modal */}
      {viewingIdea && (
        <IdeaDetail
          idea={viewingIdea}
          onClose={() => setViewingIdea(null)}
          onEdit={(idea) => {
            setViewingIdea(null);
            openEditForm(idea);
          }}
          onDelete={handleDeleteIdea}
        />
      )}

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={openCreateForm}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl hover:bg-primary-700 transition-all hover:scale-110 md:hidden flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}



