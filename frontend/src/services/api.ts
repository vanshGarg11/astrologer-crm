import axios from 'axios';
import { Astrologer, Consultation, Customer, DashboardStats, ListResult, PaginatedResponse, PaginationMeta } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper: convert camelCase keys to snake_case for frontend types
const toSnake = (key: string) => (/^[A-Z]/.test(key) ? key : key.replace(/([A-Z])/g, '_$1').toLowerCase());

function normalizeValue(value: any): any {
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === 'object') return normalizeObject(value);
  return value;
}

function normalizeObject(obj: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  Object.entries(obj).forEach(([k, v]) => {
    const nk = toSnake(k);
    out[nk] = normalizeValue(v);
  });
  return out;
}

api.interceptors.response.use(
  (response) => {
    try {
      if (response && response.data && (typeof response.data === 'object')) {
        response.data = normalizeValue(response.data);
      }
    } catch (e) {
      // keep original response if normalization fails
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    
    // Provide helpful error messages
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          ...error,
          message: 'Request timeout. Please check your connection.',
          isTimeout: true,
        });
      }
      if (error.message === 'Network Error') {
        return Promise.reject({
          ...error,
          message: 'Network error. Backend may be unavailable. Check server is running on ' + (import.meta.env.VITE_API_URL || 'http://localhost:5000'),
          isNetworkError: true,
        });
      }
    }
    
    return Promise.reject(error);
  },
);

const defaultMeta: PaginationMeta = { page: 1, limit: 25, total: 0, pages: 1 };

const unwrapList = <T>(payload: T[] | PaginatedResponse<T>): ListResult<T> => {
  if (Array.isArray(payload)) {
    return { items: payload, meta: { ...defaultMeta, total: payload.length, pages: Math.max(Math.ceil(payload.length / defaultMeta.limit), 1) } };
  }
  return { items: payload.data, meta: payload.meta };
};

const listParams = (params?: Record<string, string | number>) => ({ page: 1, limit: 100, ...params });

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
};

export const dashboardApi = {
  stats: () => api.get<DashboardStats>('/dashboard/stats'),
};

export const astrologerApi = {
  list: async (params?: Record<string, string | number>) => unwrapList((await api.get<PaginatedResponse<Astrologer> | Astrologer[]>('/astrologers', { params: listParams(params) })).data),
  create: (data: Omit<Astrologer, 'id'>) => api.post<Astrologer>('/astrologers', data),
  update: (id: string, data: Omit<Astrologer, 'id'>) => api.put<Astrologer>(`/astrologers/${id}`, data),
  remove: (id: string) => api.delete(`/astrologers/${id}`),
};

export const customerApi = {
  list: async (params?: Record<string, string | number>) => unwrapList((await api.get<PaginatedResponse<Customer> | Customer[]>('/customers', { params: listParams(params) })).data),
  create: (data: Omit<Customer, 'id'>) => api.post<Customer>('/customers', data),
  update: (id: string, data: Omit<Customer, 'id'>) => api.put<Customer>(`/customers/${id}`, data),
  remove: (id: string) => api.delete(`/customers/${id}`),
};

export const consultationApi = {
  list: async (params?: Record<string, string | number>) => unwrapList((await api.get<PaginatedResponse<Consultation> | Consultation[]>('/consultations', { params: listParams(params) })).data),
  create: (data: Omit<Consultation, 'id' | 'customer_name' | 'astrologer_name'>) => api.post<Consultation>('/consultations', data),
  update: (id: string, data: Omit<Consultation, 'id' | 'customer_name' | 'astrologer_name'>) => api.put<Consultation>(`/consultations/${id}`, data),
  remove: (id: string) => api.delete(`/consultations/${id}`),
};

export default api;
