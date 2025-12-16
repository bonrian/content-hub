import React, { useState } from 'react';
import { X, Sparkles, Loader2, Wand2, Save, Check } from 'lucide-react';
import { generateBatchIdeas, GeneratedIdea } from '../services/aiService';
import { ideasAPI } from '../services/api';
import toast from 'react-hot-toast';

interface BulkIdeaGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const BulkIdeaGenerator: React.FC<BulkIdeaGeneratorProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [persona, setPersona] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!persona.trim()) {
      toast.error('Vui lòng nhập đối tượng khách hàng!');
      return;
    }

    if (!industry.trim()) {
      toast.error('Vui lòng nhập ngành nghề!');
      return;
    }

    setLoading(true);
    setIdeas([]);
    setSelectedIdeas(new Set());

    try {
      const result = await generateBatchIdeas({
        persona: persona.trim(),
        industry: industry.trim(),
        count: 10,
        // provider will be auto-selected by backend (OpenAI by default)
        temperature: 0.9
      });

      if (result.ideas && result.ideas.length > 0) {
        setIdeas(result.ideas);
        // Auto-select all ideas
        setSelectedIdeas(new Set(result.ideas.map((_, idx) => idx)));
        toast.success(`✨ Đã tạo ${result.ideas.length} ý tưởng!`);
      } else {
        toast.error('Không thể tạo ý tưởng. Vui lòng thử lại!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gọi AI');
      console.error('Batch AI Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIdea = (index: number) => {
    const newSelected = new Set(selectedIdeas);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIdeas(newSelected);
  };

  const handleSave = async () => {
    if (selectedIdeas.size === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ý tưởng!');
      return;
    }

    setSaving(true);

    try {
      const ideasToSave = Array.from(selectedIdeas).map(idx => ideas[idx]);
      
      // Save ideas one by one
      let successCount = 0;
      let errorCount = 0;

      for (const idea of ideasToSave) {
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
        toast.success(`✅ Đã lưu ${successCount}/${ideasToSave.length} ý tưởng!`);
        if (onSaved) {
          onSaved();
        }
        // Reset after save
        setIdeas([]);
        setSelectedIdeas(new Set());
        setPersona('');
        setIndustry('');
        onClose();
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
      blog: 'bg-blue-100 text-blue-700',
      video: 'bg-red-100 text-red-700',
      'social-media': 'bg-pink-100 text-pink-700',
      podcast: 'bg-purple-100 text-purple-700',
      newsletter: 'bg-green-100 text-green-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.other;
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return colors[priority] || colors.medium;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
          <div className="flex items-center gap-3 text-white">
            <Wand2 className="w-7 h-7" />
            <div>
              <h2 className="text-2xl font-bold">
                🚀 Bulk Idea Generator
              </h2>
              <p className="text-sm text-purple-100 mt-1">
                AI tạo 10 ý tưởng nội dung cùng lúc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Input Form */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Persona */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👥 Đối tượng khách hàng (Persona)
                </label>
                <input
                  type="text"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  placeholder="VD: Doanh nhân trẻ 25-35 tuổi, có thu nhập cao"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏢 Ngành nghề / Lĩnh vực
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="VD: Công nghệ, Fintech, E-commerce"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !persona.trim() || !industry.trim()}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-bold text-lg shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Đang tạo 10 ý tưởng...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  ✨ Tạo 10 Ý Tưởng với AI
                </>
              )}
            </button>
          </div>

          {/* Ideas Grid */}
          {ideas.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  🎯 {ideas.length} ý tưởng đã tạo
                </h3>
                <div className="text-sm text-gray-600">
                  Đã chọn: <span className="font-bold text-purple-600">{selectedIdeas.size}</span>/{ideas.length}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {ideas.map((idea, index) => (
                  <div
                    key={index}
                    onClick={() => toggleIdea(index)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                      selectedIdeas.has(index)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedIdeas.has(index)
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedIdeas.has(index) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {idea.title}
                        </h4>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {idea.description}
                    </p>

                    {/* Rationale */}
                    {idea.rationale && (
                      <div className="mb-3 p-2 bg-blue-50 border-l-2 border-blue-400 rounded">
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
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(idea.category)}`}>
                        {idea.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(idea.priority)}`}>
                        {idea.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || selectedIdeas.size === 0}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-lg shadow-lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      💾 Lưu {selectedIdeas.size} ý tưởng đã chọn
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (selectedIdeas.size === ideas.length) {
                      setSelectedIdeas(new Set());
                    } else {
                      setSelectedIdeas(new Set(ideas.map((_, idx) => idx)));
                    }
                  }}
                  className="px-6 py-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                >
                  {selectedIdeas.size === ideas.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && ideas.length === 0 && (
            <div className="text-center py-12">
              <Wand2 className="w-16 h-16 mx-auto text-purple-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Nhập persona và ngành nghề, sau đó bấm "Tạo 10 Ý Tưởng"
              </p>
              <p className="text-gray-400 text-sm mt-2">
                AI sẽ tạo ra 10 ý tưởng nội dung đa dạng và phù hợp
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkIdeaGenerator;

