import { BarChart3, TrendingUp, Users, FileText, Calendar } from 'lucide-react';
import StatusChart from '../components/charts/StatusChart';
import CategoryChart from '../components/charts/CategoryChart';
import PriorityChart from '../components/charts/PriorityChart';
import { useIdeasOptimistic } from '../hooks/useIdeasOptimistic';

export default function Analytics() {
  const { ideas, loading } = useIdeasOptimistic();

  // Calculate stats
  const totalIdeas = ideas.length;
  const completedIdeas = ideas.filter(i => i.status === 'completed').length;
  const inProgressIdeas = ideas.filter(i => i.status === 'in-progress').length;
  const completionRate = totalIdeas > 0 ? ((completedIdeas / totalIdeas) * 100).toFixed(1) : 0;

  const stats = [
    { label: 'Tổng số ý tưởng', value: totalIdeas, icon: FileText, color: 'bg-blue-500' },
    { label: 'Hoàn thành', value: completedIdeas, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Đang thực hiện', value: inProgressIdeas, icon: Calendar, color: 'bg-yellow-500' },
    { label: 'Tỷ lệ hoàn thành', value: `${completionRate}%`, icon: BarChart3, color: 'bg-purple-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            Analytics & Báo cáo
          </h1>
          <p className="text-gray-600">Phân tích hiệu suất và thống kê ý tưởng nội dung</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Phân bố theo trạng thái</h2>
            <StatusChart ideas={ideas} />
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Phân bố theo danh mục</h2>
            <CategoryChart ideas={ideas} />
          </div>
        </div>

        {/* Priority Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Phân tích độ ưu tiên</h2>
          <PriorityChart ideas={ideas} />
        </div>

        {/* Additional Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Engagement</h3>
            </div>
            <p className="text-sm text-blue-700">
              Ý tưởng có độ ưu tiên cao đang được ưu tiên thực hiện
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Xu hướng</h3>
            </div>
            <p className="text-sm text-green-700">
              Số lượng ý tưởng mới tăng đều trong tuần qua
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Hiệu suất</h3>
            </div>
            <p className="text-sm text-purple-700">
              Tỷ lệ hoàn thành cao hơn 20% so với tháng trước
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

