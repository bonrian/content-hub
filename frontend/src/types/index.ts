// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Idea types
export type IdeaCategory = 'blog' | 'video' | 'social-media' | 'podcast' | 'newsletter' | 'other';
export type IdeaStatus = 'draft' | 'in-progress' | 'completed' | 'archived';
export type IdeaPriority = 'low' | 'medium' | 'high';

export interface Idea {
  _id: string;
  title: string;
  description?: string;
  category: IdeaCategory;
  status: IdeaStatus;
  priority: IdeaPriority;
  tags: string[];
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IdeaFormData {
  title: string;
  description?: string;
  category: IdeaCategory;
  status: IdeaStatus;
  priority: IdeaPriority;
  tags: string[];
}

export interface IdeasResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Idea[];
}

export interface IdeaResponse {
  success: boolean;
  message?: string;
  data: Idea;
}

export interface StatsData {
  total: number;
  byStatus: { _id: IdeaStatus; count: number }[];
  byCategory: { _id: IdeaCategory; count: number }[];
  byPriority: { _id: IdeaPriority; count: number }[];
}

export interface StatsResponse {
  success: boolean;
  data: StatsData;
}

// Filter types
export interface IdeaFilters {
  page?: number;
  limit?: number;
  status?: IdeaStatus;
  category?: IdeaCategory;
  priority?: IdeaPriority;
  search?: string;
}

// API Error type
export interface ApiError {
  success: false;
  message: string;
}



