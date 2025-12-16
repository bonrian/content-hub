import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Wand2, TrendingUp } from 'lucide-react';
import { getAIProviders, generateContentIdea, improveIdea, AIProviders, AIResponse } from '../services/aiService';
import toast from 'react-hot-toast';

interface AIGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'generate' | 'improve';
  currentTitle?: string;
  currentDescription?: string;
  category?: string;
  onApply: (data: { title?: string; description?: string; tags?: string[] }) => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({
  isOpen,
  onClose,
  mode,
  currentTitle = '',
  currentDescription = '',
  category = 'blog',
  onApply
}) => {
  const [providers, setProviders] = useState<AIProviders>({});
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);

  // Load providers on mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await getAIProviders();
        setProviders(data);
        
        // Find first enabled provider
        const enabledProvider = Object.keys(data).find(key => data[key].enabled);
        if (enabledProvider) {
          setSelectedProvider(enabledProvider);
          if (data[enabledProvider].models.length > 0) {
            setSelectedModel(data[enabledProvider].models[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading providers:', error);
      }
    };

    if (isOpen) {
      loadProviders();
    }
  }, [isOpen]);

  // Update model when provider changes
  useEffect(() => {
    if (providers[selectedProvider]?.models.length > 0) {
      setSelectedModel(providers[selectedProvider].models[0].id);
    }
  }, [selectedProvider, providers]);

  const handleGenerate = async () => {
    if (mode === 'generate' && !topic.trim()) {
      toast.error('Vui lòng nhập chủ đề!');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response: AIResponse;

      if (mode === 'generate') {
        response = await generateContentIdea({
          topic: topic.trim(),
          category,
          provider: selectedProvider,
          temperature
        });
      } else {
        response = await improveIdea({
          title: currentTitle,
          description: currentDescription,
          provider: selectedProvider,
          temperature
        });
      }

      setResult(response);
      toast.success(`✨ Đã tạo với ${providers[selectedProvider]?.name}!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gọi AI');
      console.error('AI Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result?.parsed) {
      onApply({
        title: result.parsed.title,
        description: result.parsed.description,
        tags: result.parsed.tags
      });
      toast.success('✅ Đã áp dụng nội dung AI!');
      onClose();
    } else if (result?.content) {
      // If no parsed data, put raw content in description
      onApply({
        description: result.content
      });
      toast.success('✅ Đã áp dụng nội dung AI!');
      onClose();
    }
  };

  if (!isOpen) return null;

  const enabledProviders = Object.keys(providers).filter(key => providers[key].enabled);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="flex items-center gap-3 text-white">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">
                {mode === 'generate' ? '✨ Tạo Ý Tưởng với AI' : '🚀 Cải Thiện Ý Tưởng'}
              </h2>
              <p className="text-sm text-purple-100 mt-1">
                Powered by {providers[selectedProvider]?.name || 'AI'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* No providers enabled */}
          {enabledProviders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Chưa có AI Provider nào được cấu hình</p>
              <p className="text-sm mt-2">
                Vui lòng thêm API key vào file .env của backend
              </p>
            </div>
          )}

          {enabledProviders.length > 0 && (
            <>
              {/* Provider Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🤖 AI Provider
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {enabledProviders.map(key => (
                    <button
                      key={key}
                      onClick={() => setSelectedProvider(key)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedProvider === key
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{providers[key].name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {providers[selectedProvider]?.models.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Temperature */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌡️ Độ sáng tạo (Temperature): {temperature.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Chính xác (0.0)</span>
                  <span>Cân bằng (1.0)</span>
                  <span>Sáng tạo (2.0)</span>
                </div>
              </div>

              {/* Input based on mode */}
              {mode === 'generate' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💡 Chủ đề bạn muốn tạo ý tưởng
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="VD: Marketing cho startup công nghệ"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={loading}
                  />
                </div>
              )}

              {mode === 'improve' && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Ý tưởng hiện tại:</p>
                  <p className="font-medium">{currentTitle || '(Chưa có tiêu đề)'}</p>
                  {currentDescription && (
                    <p className="text-sm text-gray-600 mt-2">{currentDescription}</p>
                  )}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || (mode === 'generate' && !topic.trim())}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    {mode === 'generate' ? (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Tạo Ý Tưởng
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5" />
                        Cải Thiện
                      </>
                    )}
                  </>
                )}
              </button>

              {/* Result */}
              {result && (
                <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Kết quả từ AI:</h3>
                  </div>

                  {result.parsed ? (
                    <div className="space-y-3">
                      {result.parsed.title && (
                        <div>
                          <p className="text-xs text-purple-600 font-medium mb-1">TIÊU ĐỀ</p>
                          <p className="font-medium text-gray-900">{result.parsed.title}</p>
                        </div>
                      )}
                      {result.parsed.description && (
                        <div>
                          <p className="text-xs text-purple-600 font-medium mb-1">MÔ TẢ</p>
                          <p className="text-gray-700">{result.parsed.description}</p>
                        </div>
                      )}
                      {result.parsed.tags && result.parsed.tags.length > 0 && (
                        <div>
                          <p className="text-xs text-purple-600 font-medium mb-1">TAGS</p>
                          <div className="flex flex-wrap gap-2">
                            {result.parsed.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.parsed.suggestions && result.parsed.suggestions.length > 0 && (
                        <div>
                          <p className="text-xs text-purple-600 font-medium mb-1">GỢI Ý</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                            {result.parsed.suggestions.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-700 whitespace-pre-wrap">{result.content}</div>
                  )}

                  {/* Apply Button */}
                  <button
                    onClick={handleApply}
                    className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    ✅ Áp dụng nội dung này
                  </button>

                  {/* Usage Info */}
                  {result.usage && (
                    <div className="mt-3 text-xs text-gray-500 text-center">
                      Tokens: {result.usage.totalTokens || 0}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;


