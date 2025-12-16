import React, { useState } from 'react';
import { Loader2, Sparkles, Save, AlertCircle } from 'lucide-react';
import { generateBatchIdeas, GeneratedIdea } from '../services/aiService';
import { ideasAPI } from '../services/api';
import toast from 'react-hot-toast';

interface SimpleIdeaGeneratorProps {
  onIdeasSaved?: () => void;
}

const SimpleIdeaGenerator: React.FC<SimpleIdeaGeneratorProps> = ({ onIdeasSaved }) => {
  const [persona, setPersona] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    // Validation
    if (!persona.trim()) {
      toast.error('Vui lòng nhập đối tượng khách hàng!');
      return;
    }

    if (!industry.trim()) {
      toast.error('Vui lòng nhập ngành nghề!');
      return;
    }

    setLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const result = await generateBatchIdeas({
        persona: persona.trim(),
        industry: industry.trim(),
        count: 10,
        temperature: 0.9
      });

      if (result.ideas && result.ideas.length > 0) {
        setIdeas(result.ideas);
        toast.success(`✨ Đã tạo ${result.ideas.length} ý tưởng thành công!`);
      } else {
        setError('Không thể tạo ý tưởng. Vui lòng thử lại!');
        toast.error('Không thể tạo ý tưởng. Vui lòng thử lại!');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi gọi AI';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('AI Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (ideas.length === 0) return;

    setSaving(true);

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const idea of ideas) {
        try {
          await ideasAPI.create({
            title: idea.title,
            description: idea.description,
            category: idea.category as any,
            status: 'draft',
            priority: idea.priority as any,
            tags: idea.tags
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Error saving idea:', error);
        }
      }

      if (successCount > 0) {
        toast.success(`✅ Đã lưu ${successCount}/${ideas.length} ý tưởng!`);
        if (onIdeasSaved) {
          onIdeasSaved();
        }
        // Reset after save
        setIdeas([]);
        setPersona('');
        setIndustry('');
      }

      if (errorCount > 0) {
        toast.error(`⚠️ ${errorCount} ý tưởng không lưu được`);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu ý tưởng');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      blog: 'bg-blue-100 text-blue-700 border-blue-300',
      video: 'bg-red-100 text-red-700 border-red-300',
      'social-media': 'bg-pink-100 text-pink-700 border-pink-300',
      podcast: 'bg-purple-100 text-purple-700 border-purple-300',
      newsletter: 'bg-green-100 text-green-700 border-green-300',
      other: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[category] || colors.other;
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: 'bg-red-50 text-red-700 border-red-300',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-300',
      low: 'bg-green-50 text-green-700 border-green-300'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          AI Idea Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Persona Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👥 Đối tượng khách hàng (Persona)
            </label>
            <input
              type="text"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="VD: Millennials 25-35 tuổi, yêu thích công nghệ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Industry Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏢 Ngành nghề / Lĩnh vực
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="VD: E-commerce, Mobile Apps, SaaS"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !persona.trim() || !industry.trim()}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Đang tạo 10 ý tưởng...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Generate Ideas
            </>
          )}
        </button>

        {/* Helper Text */}
        {!loading && ideas.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-3">
            💡 Nhập thông tin và bấm "Generate Ideas" để AI tạo 10 ý tưởng cho bạn
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900">
              AI đang suy nghĩ...
            </h3>
            <p className="text-gray-600">
              Đang tạo 10 ý tưởng phù hợp với đối tượng và ngành nghề của bạn
            </p>
            <div className="flex gap-2 mt-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Có lỗi xảy ra</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={handleGenerate}
                className="mt-3 text-sm text-red-800 hover:text-red-900 underline font-medium"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ideas Display */}
      {ideas.length > 0 && !loading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              🎯 {ideas.length} ý tưởng đã tạo
            </h3>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Lưu tất cả {ideas.length} ý tưởng
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
              >
                {/* Title */}
                <h4 className="font-bold text-gray-900 mb-2 text-lg">
                  {index + 1}. {idea.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {idea.description}
                </p>

                {/* Rationale */}
                {idea.rationale && (
                  <div className="mb-3 p-2 bg-blue-50 border-l-3 border-blue-400 rounded">
                    <p className="text-xs text-blue-800">
                      <span className="font-semibold">💡 Lý do: </span>
                      {idea.rationale}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {idea.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Category & Priority */}
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(idea.category)}`}>
                    {idea.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(idea.priority)}`}>
                    {idea.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleIdeaGenerator;


