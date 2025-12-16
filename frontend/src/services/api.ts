import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  IdeasResponse,
  IdeaResponse,
  IdeaFormData,
  IdeaFilters,
  StatsResponse,
  ApiError,
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/auth/updateprofile', data);
    return response.data;
  },

  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/updatepassword', data);
    return response.data;
  },
};

// Ideas API
export const ideasAPI = {
  getAll: async (filters?: IdeaFilters): Promise<IdeasResponse> => {
    const response = await api.get<IdeasResponse>('/ideas', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<IdeaResponse> => {
    const response = await api.get<IdeaResponse>(`/ideas/${id}`);
    return response.data;
  },

  create: async (data: IdeaFormData): Promise<IdeaResponse> => {
    const response = await api.post<IdeaResponse>('/ideas', data);
    return response.data;
  },

  update: async (id: string, data: Partial<IdeaFormData>): Promise<IdeaResponse> => {
    const response = await api.put<IdeaResponse>(`/ideas/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/ideas/${id}`);
    return response.data;
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get<StatsResponse>('/ideas/stats');
    return response.data;
  },
};

export default api;



