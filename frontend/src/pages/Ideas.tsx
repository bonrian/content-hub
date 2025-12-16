import { useState } from 'react';
import { Plus } from 'lucide-react';
import IdeaList from '../components/IdeaList';
import IdeaForm from '../components/IdeaForm';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import { useIdeasOptimistic } from '../hooks/useIdeasOptimistic';
import type { IdeaFilters } from '../types';

export default function Ideas() {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<IdeaFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { ideas, loading, createIdea, updateIdea, deleteIdea } = useIdeasOptimistic(filters, searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: IdeaFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý ý tưởng</h1>
          <p className="text-gray-600">Tạo, chỉnh sửa và quản lý tất cả ý tưởng nội dung của bạn</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <SearchBar onSearch={handleSearch} />
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Tạo ý tưởng mới
          </button>
        </div>

        {/* Ideas List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">Chưa có ý tưởng nào. Hãy tạo ý tưởng đầu tiên!</p>
          </div>
        ) : (
          <IdeaList
            ideas={ideas}
            onEdit={(idea) => {
              setShowForm(true);
              // Pass idea to form for editing
            }}
            onDelete={deleteIdea}
          />
        )}

        {/* Idea Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Tạo ý tưởng mới</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <IdeaForm
                  onSubmit={async (data) => {
                    await createIdea(data);
                    setShowForm(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

