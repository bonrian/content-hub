const { generateContent, generateContentIdea, improveIdea, generateBatchIdeas } = require('../services/aiService');

// @desc    Generate content with AI
// @route   POST /api/ai/generate
// @access  Private
exports.generate = async (req, res, next) => {
  try {
    const { prompt, provider, model, temperature } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập prompt'
      });
    }

    const result = await generateContent({
      prompt,
      provider: provider || 'openai',
      model,
      temperature: temperature !== undefined ? temperature : 0.7
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Generate content idea
// @route   POST /api/ai/idea
// @access  Private
exports.generateIdea = async (req, res, next) => {
  try {
    const { topic, category, provider, temperature } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập chủ đề'
      });
    }

    const result = await generateContentIdea({
      topic,
      category: category || 'blog',
      provider: provider || 'openai',
      temperature: temperature !== undefined ? temperature : 0.8
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Improve existing idea
// @route   POST /api/ai/improve
// @access  Private
exports.improveIdea = async (req, res, next) => {
  try {
    const { title, description, provider, temperature } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tiêu đề'
      });
    }

    const result = await improveIdea({
      title,
      description,
      provider: provider || 'openai',
      temperature: temperature !== undefined ? temperature : 0.7
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Generate batch of ideas
// @route   POST /api/ai/batch-ideas
// @access  Private
exports.generateBatchIdeas = async (req, res, next) => {
  try {
    const { persona, industry, count, provider, temperature } = req.body;

    if (!persona || !persona.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đối tượng khách hàng (persona)'
      });
    }

    if (!industry || !industry.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập ngành nghề/lĩnh vực'
      });
    }

    const result = await generateBatchIdeas({
      persona: persona.trim(),
      industry: industry.trim(),
      count: count || 10,
      provider: provider || 'gemini', // Use Gemini (now using direct REST API)
      temperature: temperature !== undefined ? temperature : 0.9
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get available AI providers and models
// @route   GET /api/ai/providers
// @access  Private
exports.getProviders = async (req, res, next) => {
  try {
    const providers = {
      openai: {
        name: 'OpenAI',
        models: [
          { id: 'gpt-4', name: 'GPT-4', description: 'Mạnh nhất, chậm hơn' },
          { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Nhanh hơn GPT-4' },
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Nhanh, rẻ' }
        ],
        enabled: !!process.env.OPENAI_API_KEY
      },
      gemini: {
        name: 'Google Gemini',
        models: [
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Mới nhất, nhanh, miễn phí' },
          { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Exp', description: 'Experimental, nhanh' }
        ],
        enabled: !!process.env.GEMINI_API_KEY
      },
      anthropic: {
        name: 'Anthropic Claude',
        models: [
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Mạnh nhất' },
          { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Cân bằng' },
          { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Nhanh nhất' }
        ],
        enabled: !!process.env.ANTHROPIC_API_KEY
      },
      deepseek: {
        name: 'Deepseek',
        models: [
          { id: 'deepseek-chat', name: 'Deepseek Chat', description: 'Model chat' },
          { id: 'deepseek-coder', name: 'Deepseek Coder', description: 'Tối ưu cho code' }
        ],
        enabled: !!process.env.DEEPSEEK_API_KEY
      }
    };

    res.status(200).json({
      success: true,
      data: providers
    });

  } catch (error) {
    next(error);
  }
};

