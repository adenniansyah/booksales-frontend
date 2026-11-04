// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Sesuaikan port backend Laravel Anda
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json' // ⚠️ PENTING: Wajib ada untuk Laravel API
  }
});

// Interceptor Token (Opsional: Aktifkan jika sudah pakai JWT Auth)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// ✅ EKSPOR FUNGSI GENRE
export const genreApi = {
  getAll: () => api.get('/genres'),
  create: (data) => api.post('/genres', data),
  update: (id, data) => api.put(`/genres/${id}`, data),   // Fitur Update
  delete: (id) => api.delete(`/genres/${id}`)             // Fitur Delete
};

// ✅ EKSPOR FUNGSI AUTHOR
export const authorApi = {
  getAll: () => api.get('/authors'),
  create: (data) => api.post('/authors', data),
  update: (id, data) => api.put(`/authors/${id}`, data),  // Fitur Update
  delete: (id) => api.delete(`/authors/${id}`)            // Fitur Delete
};