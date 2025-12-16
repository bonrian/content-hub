import { useState, useEffect } from 'react';
import { ideasAPI } from '../services/api';
import type { Idea, IdeaFilters, IdeaFormData, StatsData } from '../types';
import toast from 'react-hot-toast';

export const useIdeas = (filters?: IdeaFilters) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ideasAPI.getAll(filters);
      setIdeas(response.data);
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Lỗi khi tải danh sách ý tưởng';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [filters?.page, filters?.status, filters?.category, filters?.priority, filters?.search]);

  const createIdea = async (data: IdeaFormData) => {
    try {
      const response = await ideasAPI.create(data);
      toast.success(response.message || 'Tạo ý tưởng thành công!');
      await fetchIdeas(); // Reload list
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Lỗi khi tạo ý tưởng';
      toast.error(message);
      throw err;
    }
  };

  const updateIdea = async (id: string, data: Partial<IdeaFormData>) => {
    try {
      const response = await ideasAPI.update(id, data);
      toast.success(response.message || 'Cập nhật thành công!');
      await fetchIdeas(); // Reload list
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Lỗi khi cập nhật ý tưởng';
      toast.error(message);
      throw err;
    }
  };

  const deleteIdea = async (id: string) => {
    try {
      await ideasAPI.delete(id);
      toast.success('Xóa ý tưởng thành công!');
      await fetchIdeas(); // Reload list
    } catch (err: any) {
      const message = err.response?.data?.message || 'Lỗi khi xóa ý tưởng';
      toast.error(message);
      throw err;
    }
  };

  return {
    ideas,
    isLoading,
    error,
    pagination,
    refetch: fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
  };
};

export const useStats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await ideasAPI.getStats();
        setStats(response.data);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Lỗi khi tải thống kê';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
};



