import api from './api';

export interface AIProvider {
  name: string;
  models: {
    id: string;
    name: string;
    description: string;
  }[];
  enabled: boolean;
}

export interface AIProviders {
  [key: string]: AIProvider;
}

export interface GenerateRequest {
  prompt: string;
  provider?: string;
  model?: string;
  temperature?: number;
}

export interface GenerateIdeaRequest {
  topic: string;
  category?: string;
  provider?: string;
  temperature?: number;
}

export interface ImproveIdeaRequest {
  title: string;
  description?: string;
  provider?: string;
  temperature?: number;
}

export interface BatchIdeasRequest {
  persona: string;
  industry: string;
  count?: number;
  provider?: string;
  temperature?: number;
}

export interface GeneratedIdea {
  title: string;
  description: string;
  rationale: string;
  category: string;
  tags: string[];
  priority: string;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  parsed?: {
    title?: string;
    description?: string;
    tags?: string[];
    suggestions?: string[];
  };
}

// Get available AI providers
export const getAIProviders = async (): Promise<AIProviders> => {
  const response = await api.get<{ success: boolean; data: AIProviders }>('/ai/providers');
  return response.data.data;
};

// Generate content with custom prompt
export const generateContent = async (request: GenerateRequest): Promise<AIResponse> => {
  const response = await api.post<{ success: boolean; data: AIResponse }>('/ai/generate', request);
  return response.data.data;
};

// Generate content idea from topic
export const generateContentIdea = async (request: GenerateIdeaRequest): Promise<AIResponse> => {
  const response = await api.post<{ success: boolean; data: AIResponse }>('/ai/idea', request);
  return response.data.data;
};

// Improve existing idea
export const improveIdea = async (request: ImproveIdeaRequest): Promise<AIResponse> => {
  const response = await api.post<{ success: boolean; data: AIResponse }>('/ai/improve', request);
  return response.data.data;
};

// Generate batch of ideas from persona and industry
export const generateBatchIdeas = async (request: BatchIdeasRequest): Promise<{
  ideas: GeneratedIdea[];
  count: number;
  provider: string;
  model: string;
}> => {
  const response = await api.post<{ 
    success: boolean; 
    data: { 
      ideas: GeneratedIdea[];
      count: number;
      provider: string;
      model: string;
    } 
  }>('/ai/batch-ideas', request);
  return response.data.data;
};

