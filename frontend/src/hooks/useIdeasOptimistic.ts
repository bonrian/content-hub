import { useState, useEffect, useCallback } from 'react';
import { ideasAPI } from '../services/api';
import type { Idea, IdeaFilters, IdeaFormData, StatsData } from '../types';
import toast from 'react-hot-toast';

/**
 * Enhanced useIdeas hook with optimistic updates
 */
export const useIdeasOptimistic = (filters?: IdeaFilters) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });

  // Fetch ideas
  const fetchIdeas = useCallback(async () => {
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
  }, [filters?.page, filters?.status, filters?.category, filters?.priority, filters?.search]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  /**
   * Create idea with optimistic update
   */
  const createIdea = async (data: IdeaFormData) => {
    // Create temporary optimistic idea
    const optimisticIdea: Idea = {
      _id: `temp-${Date.now()}`,
      ...data,
      description: data.description || '',
      tags: data.tags || [],
      user: {
        _id: 'current-user',
        name: 'You',
        email: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistically add to list
    setIdeas((prev) => [optimisticIdea, ...prev]);
    setPagination((prev) => ({ ...prev, total: prev.total + 1 }));

    // Show optimistic toast
    const toastId = toast.loading('Đang tạo ý tưởng...');

    try {
      const response = await ideasAPI.create(data);
      
      // Replace optimistic idea with real one
      setIdeas((prev) =>
        prev.map((idea) => (idea._id === optimisticIdea._id ? response.data : idea))
      );

      toast.success('Tạo ý tưởng thành công!', { id: toastId });
      return response.data;
    } catch (err: any) {
      // Rollback on error
      setIdeas((prev) => prev.filter((idea) => idea._id !== optimisticIdea._id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));

      const message = err.response?.data?.message || 'Lỗi khi tạo ý tưởng';
      toast.error(message, { id: toastId });
      throw err;
    }
  };

  /**
   * Update idea with optimistic update
   */
  const updateIdea = async (id: string, data: Partial<IdeaFormData>) => {
    // Store original for rollback
    const originalIdea = ideas.find((idea) => idea._id === id);
    if (!originalIdea) return;

    // Optimistically update
    setIdeas((prev) =>
      prev.map((idea) =>
        idea._id === id
          ? { ...idea, ...data, updatedAt: new Date().toISOString() }
          : idea
      )
    );

    const toastId = toast.loading('Đang cập nhật...');

    try {
      const response = await ideasAPI.update(id, data);
      
      // Update with server response
      setIdeas((prev) =>
        prev.map((idea) => (idea._id === id ? response.data : idea))
      );

      toast.success('Cập nhật thành công!', { id: toastId });
      return response.data;
    } catch (err: any) {
      // Rollback on error
      setIdeas((prev) =>
        prev.map((idea) => (idea._id === id ? originalIdea : idea))
      );

      const message = err.response?.data?.message || 'Lỗi khi cập nhật';
      toast.error(message, { id: toastId });
      throw err;
    }
  };

  /**
   * Delete idea with optimistic update
   */
  const deleteIdea = async (id: string) => {
    // Store original for rollback
    const originalIdea = ideas.find((idea) => idea._id === id);
    if (!originalIdea) return;

    const originalIndex = ideas.findIndex((idea) => idea._id === id);

    // Optimistically remove
    setIdeas((prev) => prev.filter((idea) => idea._id !== id));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));

    const toastId = toast.loading('Đang xóa...');

    try {
      await ideasAPI.delete(id);
      toast.success('Xóa ý tưởng thành công!', { id: toastId });
    } catch (err: any) {
      // Rollback on error
      setIdeas((prev) => {
        const newIdeas = [...prev];
        newIdeas.splice(originalIndex, 0, originalIdea);
        return newIdeas;
      });
      setPagination((prev) => ({ ...prev, total: prev.total + 1 }));

      const message = err.response?.data?.message || 'Lỗi khi xóa';
      toast.error(message, { id: toastId });
      throw err;
    }
  };

  /**
   * Quick status update (common action)
   */
  const updateStatus = async (id: string, status: Idea['status']) => {
    await updateIdea(id, { status });
  };

  /**
   * Quick priority update (common action)
   */
  const updatePriority = async (id: string, priority: Idea['priority']) => {
    await updateIdea(id, { priority });
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
    updateStatus,
    updatePriority,
  };
};

/**
 * Stats hook with caching
 */
export const useStatsWithCache = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const CACHE_DURATION = 60000; // 1 minute

  const fetchStats = useCallback(async (force = false) => {
    // Return cached if recent
    if (!force && Date.now() - lastFetch < CACHE_DURATION && stats) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await ideasAPI.getStats();
      setStats(response.data);
      setLastFetch(Date.now());
    } catch (err: any) {
      const message = err.response?.data?.message || 'Lỗi khi tải thống kê';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [lastFetch, stats]);

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: () => fetchStats(true),
  };
};



