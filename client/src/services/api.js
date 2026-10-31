import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid/expired - clear invalid token if in private area
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const loginApi = (data) => api.post('/auth/login', data);
export const registerApi = (data) => api.post('/auth/register', data);
export const getMeApi = () => api.get('/auth/me');

// --- Notice Endpoints ---
export const fetchNotices = (params) => api.get('/notices', { params });
export const fetchNoticeById = (id) => api.get(`/notices/${id}`);
export const createNoticeApi = (data) => api.post('/notices', data);
export const updateNoticeApi = (id, data) => api.put(`/notices/${id}`, data);
export const deleteNoticeApi = (id) => api.delete(`/notices/${id}`);
export const togglePinNoticeApi = (id) => api.patch(`/notices/${id}/pin`);

// --- Event Endpoints ---
export const fetchEvents = (params) => api.get('/events', { params });
export const fetchEventById = (id) => api.get(`/events/${id}`);
export const createEventApi = (data) => api.post('/events', data);
export const updateEventApi = (id, data) => api.put(`/events/${id}`, data);
export const deleteEventApi = (id) => api.delete(`/events/${id}`);
export const reviewEventApi = (id, data) => api.patch(`/events/${id}/review`, data);

// --- Admin Stats ---
export const fetchAdminStats = () => api.get('/events/admin/stats');

export default api;
