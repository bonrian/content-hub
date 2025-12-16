import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface ApiErrorResponse {
  success: false;
  message: string;
}

/**
 * Enhanced error handler for API calls
 */
export const handleApiError = (error: unknown, defaultMessage: string = 'Đã có lỗi xảy ra'): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;
    
    // API returned error message
    if (apiError?.message) {
      return apiError.message;
    }

    // HTTP status based messages
    switch (error.response?.status) {
      case 400:
        return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      case 401:
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      case 403:
        return 'Bạn không có quyền thực hiện hành động này.';
      case 404:
        return 'Không tìm thấy dữ liệu yêu cầu.';
      case 409:
        return 'Dữ liệu đã tồn tại.';
      case 422:
        return 'Dữ liệu không đúng định dạng.';
      case 429:
        return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
      case 500:
        return 'Lỗi server. Vui lòng thử lại sau.';
      case 503:
        return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
      default:
        return defaultMessage;
    }
  }

  // Network error
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    }
    return error.message;
  }

  return defaultMessage;
};

/**
 * Show error toast with proper handling
 */
export const showErrorToast = (error: unknown, defaultMessage?: string) => {
  const message = handleApiError(error, defaultMessage);
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
  });
};

/**
 * Show success toast
 */
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
};

/**
 * Show loading toast
 */
export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

/**
 * Retry logic for failed requests
 */
export const retryRequest = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2); // Exponential backoff
  }
};

/**
 * Validate form data before submission
 */
export const validateIdeaForm = (data: {
  title?: string;
  description?: string;
  tags?: string[];
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Tiêu đề là bắt buộc');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Tiêu đề không được vượt quá 200 ký tự');
  }

  if (data.description && data.description.length > 2000) {
    errors.push('Mô tả không được vượt quá 2000 ký tự');
  }

  if (data.tags && data.tags.some((tag) => tag.length > 50)) {
    errors.push('Mỗi tag không được vượt quá 50 ký tự');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};



