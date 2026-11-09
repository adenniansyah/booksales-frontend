import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  me: () => api.get('/me'),
  logout: () => api.post('/logout'),
};

export const transactionApi = {
  create: (data) => api.post('/transactions', data),
  getAll: () => api.get('/transactions'),
  updateStatus: (id, status) => api.put(`/transactions/${id}`, { status }),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export default api;