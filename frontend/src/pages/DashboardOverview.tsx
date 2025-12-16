import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, LayoutDashboard, List as ListIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIdeasOptimistic, useStatsWithCache } from '../hooks/useIdeasOptimistic';
import SearchBar from '../components/SearchBar';
import QuickFilters from '../components/QuickFilters';
import StatusChart from '../components/charts/StatusChart';
import CategoryChart from '../components/charts/CategoryChart';
import PriorityChart from '../components/charts/PriorityChart';
import RecentIdeas from '../components/RecentIdeas';
import IdeaForm from '../components/IdeaForm';
import IdeaDetail from '../components/IdeaDetail';
import StatsPanel from '../components/StatsPanel';
import type { Idea, IdeaFilters, IdeaFormData, IdeaPriority, IdeaStatus } from '../types';

/**
 * Dashboard Overview Page with Charts and Statistics
 * Perfect landing page showing high-level overview
 */
export default function DashboardOverview() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<IdeaFilters>({
    page: 1,
    limit: 100, // Get more for "recent ideas"
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingIdea, setViewingIdea] = useState<Idea | null>(null);
  
  const {
    ideas,
    isLoading,
    createIdea,
    updateIdea,
    deleteIdea,
  } = useIdeasOptimistic(filters);
  
  const { stats, refetch: refetchStats } = useStatsWithCache();

  // Handlers
  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query || undefined });
  };

  const handlePriorityFilter = (priority?: IdeaPriority) => {
    setFilters({ ...filters, priority, page: 1 });
  };

  const handleStatusFilter = (status?: IdeaStatus) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handleCreateIdea = async (data: IdeaFormData) => {
    await createIdea(data);
    refetchStats();
  };

  const handleEditIdea = async (data: IdeaFormData) => {
    if (viewingIdea) {
      await updateIdea(viewingIdea._id, data);
      refetchStats();
    }
  };

  const handleDeleteIdea = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ý tưởng này?')) {
      await deleteIdea(id);
      setViewingIdea(null);
      refetchStats();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToFullList = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent flex items-center gap-2">
                <LayoutDashboard className="w-7 h-7 text-primary-600" />
                Dashboard Tổng quan
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Xin chào, <span className="font-semibold">{user?.name}</span>! 👋
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={goToFullList}
                className="btn btn-secondary flex items-center gap-2"
              >
                <ListIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Danh sách đầy đủ</span>
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
        {stats && (
          <div className="animate-fadeIn mb-8">
            <StatsPanel stats={stats} />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Tìm kiếm ý tưởng..."
            isLoading={isLoading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Quick Filters */}
          <div className="lg:col-span-1">
            <QuickFilters
              onPriorityFilter={handlePriorityFilter}
              onStatusFilter={handleStatusFilter}
              activePriority={filters.priority}
              activeStatus={filters.status}
            />
          </div>

          {/* Right Column - Recent Ideas */}
          <div className="lg:col-span-2">
            <RecentIdeas
              ideas={ideas}
              onView={setViewingIdea}
            />
          </div>
        </div>

        {/* Charts Section */}
        {stats && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              📊 Biểu đồ phân tích
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Status Pie Chart */}
              <StatusChart stats={stats} />

              {/* Category Bar Chart */}
              <CategoryChart stats={stats} />

              {/* Priority Radar Chart */}
              <PriorityChart stats={stats} />
            </div>
          </div>
        )}

        {/* Create Button - Fixed */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl hover:bg-primary-700 transition-all hover:scale-110 flex items-center justify-center z-50"
          title="Tạo ý tưởng mới"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Idea Form Modal */}
      {isFormOpen && (
        <IdeaForm
          onSubmit={handleCreateIdea}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Idea Detail Modal */}
      {viewingIdea && (
        <IdeaDetail
          idea={viewingIdea}
          onClose={() => setViewingIdea(null)}
          onEdit={(idea) => {
            setViewingIdea(null);
            // Could open edit form here
          }}
          onDelete={handleDeleteIdea}
        />
      )}
    </div>
  );
}



