const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

// Retry helper function
const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed:`, error.message);
      
      if (i < maxRetries - 1) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// OpenAI Service
const callOpenAI = async (prompt, model = 'gpt-3.5-turbo', temperature = 0.7) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  return retry(async () => {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature,
      max_tokens: 1000
    });

    return {
      content: response.choices[0].message.content,
      model: model,
      provider: 'openai',
      usage: response.usage
    };
  });
};

// Google Gemini Service - Using direct REST API
const callGemini = async (prompt, model = 'gemini-2.5-flash', temperature = 0.7) => {
  const apiKey = process.env.GEMINI_API_KEY;
  // Add 'models/' prefix if not present
  const modelName = model.startsWith('models/') ? model : `models/${model}`;
  const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`;

  return retry(async () => {
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 4000
      }
    });

    const result = response.data;
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      content: text,
      model: model,
      provider: 'gemini',
      usage: {
        promptTokens: result.usageMetadata?.promptTokenCount || 0,
        completionTokens: result.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: result.usageMetadata?.totalTokenCount || 0
      }
    };
  });
};

// Anthropic Claude Service
const callAnthropic = async (prompt, model = 'claude-3-haiku-20240307', temperature = 0.7) => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  return retry(async () => {
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 1000,
      temperature: temperature,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      content: response.content[0].text,
      model: model,
      provider: 'anthropic',
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      }
    };
  });
};

// Deepseek Service
const callDeepseek = async (prompt, model = 'deepseek-chat', temperature = 0.7) => {
  return retry(async () => {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );

    return {
      content: response.data.choices[0].message.content,
      model: model,
      provider: 'deepseek',
      usage: response.data.usage
    };
  });
};

// Main AI Service - Route to appropriate provider
const generateContent = async ({ prompt, provider = 'openai', model, temperature = 0.7 }) => {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt không được để trống');
  }

  // Validate temperature
  if (temperature < 0 || temperature > 2) {
    throw new Error('Temperature phải nằm trong khoảng 0-2');
  }

  // Default models for each provider
  const defaultModels = {
    openai: 'gpt-3.5-turbo',
    gemini: 'gemini-2.5-flash',
    anthropic: 'claude-3-haiku-20240307',
    deepseek: 'deepseek-chat'
  };

  const selectedModel = model || defaultModels[provider];

  console.log(`🤖 Calling AI: ${provider} | Model: ${selectedModel} | Temp: ${temperature}`);

  try {
    let result;

    switch (provider.toLowerCase()) {
      case 'openai':
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY chưa được cấu hình');
        }
        result = await callOpenAI(prompt, selectedModel, temperature);
        break;

      case 'gemini':
        if (!process.env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY chưa được cấu hình');
        }
        result = await callGemini(prompt, selectedModel, temperature);
        break;

      case 'anthropic':
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error('ANTHROPIC_API_KEY chưa được cấu hình');
        }
        result = await callAnthropic(prompt, selectedModel, temperature);
        break;

      case 'deepseek':
        if (!process.env.DEEPSEEK_API_KEY) {
          throw new Error('DEEPSEEK_API_KEY chưa được cấu hình');
        }
        result = await callDeepseek(prompt, selectedModel, temperature);
        break;

      default:
        throw new Error(`Provider không hợp lệ: ${provider}`);
    }

    console.log(`✅ AI Response received from ${provider}`);
    return result;

  } catch (error) {
    console.error(`❌ AI Error (${provider}):`, error.message);
    throw new Error(`Lỗi khi gọi ${provider}: ${error.message}`);
  }
};

// Helper: Generate content idea
const generateContentIdea = async ({ topic, category, provider = 'openai', temperature = 0.8 }) => {
  const prompt = `Hãy tạo một ý tưởng nội dung ${category || 'blog'} về chủ đề: "${topic}".

Trả lời theo định dạng JSON sau:
{
  "title": "Tiêu đề hấp dẫn (tối đa 100 ký tự)",
  "description": "Mô tả chi tiết về nội dung (200-500 ký tự)",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  const result = await generateContent({ prompt, provider, temperature });

  // Try to parse JSON from response
  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...result,
        parsed: parsed
      };
    }
  } catch (e) {
    console.log('Could not parse JSON, returning raw content');
  }

  return result;
};

// Helper: Improve existing idea
const improveIdea = async ({ title, description, provider = 'openai', temperature = 0.7 }) => {
  const prompt = `Hãy cải thiện ý tưởng nội dung sau:

Tiêu đề: ${title}
Mô tả: ${description || 'Không có mô tả'}

Trả lời theo định dạng JSON:
{
  "title": "Tiêu đề được cải thiện",
  "description": "Mô tả được cải thiện và chi tiết hơn",
  "tags": ["tag1", "tag2", "tag3"],
  "suggestions": ["gợi ý 1", "gợi ý 2", "gợi ý 3"]
}`;

  const result = await generateContent({ prompt, provider, temperature });

  // Try to parse JSON
  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...result,
        parsed: parsed
      };
    }
  } catch (e) {
    console.log('Could not parse JSON, returning raw content');
  }

  return result;
};

// Validation function for batch ideas
const validateIdea = (idea) => {
  const errors = [];
  
  // Check required fields
  if (!idea.title || typeof idea.title !== 'string' || idea.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (!idea.description || typeof idea.description !== 'string' || idea.description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }
  
  if (!idea.rationale || typeof idea.rationale !== 'string' || idea.rationale.trim().length === 0) {
    errors.push('Rationale is required and must be a non-empty string');
  }
  
  // Check title length
  if (idea.title && idea.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  // Check description length
  if (idea.description && idea.description.length > 2000) {
    errors.push('Description must be less than 2000 characters');
  }
  
  return errors;
};

const validateBatchIdeas = (ideas) => {
  // Check if ideas is an array
  if (!Array.isArray(ideas)) {
    throw new Error('Ideas must be an array');
  }
  
  // Check if array is not empty
  if (ideas.length === 0) {
    throw new Error('Ideas array cannot be empty');
  }
  
  // Validate each idea
  const allErrors = [];
  ideas.forEach((idea, index) => {
    const errors = validateIdea(idea);
    if (errors.length > 0) {
      allErrors.push(`Idea ${index + 1}: ${errors.join(', ')}`);
    }
  });
  
  if (allErrors.length > 0) {
    throw new Error(`Validation failed:\n${allErrors.join('\n')}`);
  }
  
  return true;
};

// Helper: Generate batch of ideas based on persona and industry
const generateBatchIdeas = async ({ persona, industry, count = 10, provider = 'openai', temperature = 0.9 }) => {
  const prompt = `You are a content strategy expert. Generate ${count} creative and diverse content marketing ideas.

INPUT:
- Target Audience (Persona): ${persona}
- Industry/Field: ${industry}

REQUIREMENTS:
- Create ${count} DIFFERENT and DIVERSE ideas
- Each idea must fit the persona and industry
- Include various content types: blog, video, social-media, podcast, newsletter, etc.
- Each idea needs an engaging title, detailed description, and relevant tags

OUTPUT FORMAT - Return ONLY valid JSON (no other text):

Format:
{
  "ideas": [
    {
      "title": "Idea title 1",
      "description": "Detailed description",
      "rationale": "Why this fits the persona and industry",
      "category": "blog",
      "tags": ["tag1", "tag2", "tag3"],
      "priority": "high"
    }
  ]
}

IMPORTANT:
- category: blog, video, social-media, podcast, newsletter, or other
- priority: low, medium, or high
- Generate exactly ${count} different ideas
- Return ONLY the JSON object (no explanations before or after)
- Start with { and end with }`;

  // Wrap with retry logic for validation failures
  return await retry(async () => {
    const result = await generateContent({ 
      prompt, 
      provider, 
      model: provider === 'openai' ? 'gpt-3.5-turbo' : undefined,
      temperature 
    });

    console.log('🤖 AI Response length:', result.content.length);
    console.log('📝 First 200 chars:', result.content.substring(0, 200));

    // Try multiple parsing strategies
    let parsed = null;
    
    try {
      // Strategy 1: Find JSON object with "ideas" key
      let jsonMatch = result.content.match(/\{[\s\S]*?"ideas"[\s\S]*?\[\s*\{[\s\S]*?\}\s*\][\s\S]*?\}/);
      
      if (!jsonMatch) {
        // Strategy 2: Find any JSON object
        jsonMatch = result.content.match(/\{[\s\S]*?\}/);
      }
      
      if (!jsonMatch) {
        // Strategy 3: Try to parse entire content as JSON
        try {
          parsed = JSON.parse(result.content);
        } catch (directParseError) {
          console.error('❌ Direct parse failed:', directParseError.message);
        }
      } else {
        parsed = JSON.parse(jsonMatch[0]);
      }
      
      if (!parsed) {
        console.error('❌ AI Response (full):', result.content);
        throw new Error('No valid JSON found in AI response');
      }
      
      if (!parsed.ideas || !Array.isArray(parsed.ideas)) {
        console.error('❌ Parsed object:', JSON.stringify(parsed, null, 2));
        throw new Error('Response does not contain valid ideas array');
      }
      
      // Validate all ideas
      validateBatchIdeas(parsed.ideas);
      
      console.log(`✅ Successfully generated and validated ${parsed.ideas.length} ideas`);
      
      return {
        ...result,
        ideas: parsed.ideas,
        count: parsed.ideas.length
      };
      
    } catch (e) {
      console.error('❌ Validation/Parsing error:', e.message);
      // Throw error to trigger retry
      throw new Error(`Invalid AI response format: ${e.message}`);
    }
  }, 3, 2000); // Max 3 retries with 2 second delay
};

module.exports = {
  generateContent,
  generateContentIdea,
  improveIdea,
  generateBatchIdeas,
  retry
};

