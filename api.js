// src/services/api.js
import axios from 'axios';

// 1. Konfigurasi Dasar Axios
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

export const genreApi = {
  getAll: () => api.get('/genres'),
  create: (data) => api.post('/genres', data),
  update: (id, data) => api.put(`/genres/${id}`, data),
  delete: (id) => api.delete(`/genres/${id}`)
};

export const authApi = {
  register: (data) => api.post('/register', data),
  // login: (data) => api.post('/login', data),
};

export default api;