import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Validasi Sederhana di Frontend
  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Nama lengkap wajib diisi";
    if (!formData.email) {
      tempErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Format email tidak valid";
    }
    if (!formData.username) tempErrors.username = "Username wajib diisi";
    if (!formData.password) {
      tempErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password minimal 6 karakter";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Hapus error saat user mengetik ulang
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (validate()) {
      setIsLoading(true);
      try {
        // Kirim data ke backend Laravel via api.js
        await authApi.register(formData);
        
        alert('Registrasi Berhasil! Selamat datang di BookSales.');
        navigate('/'); // ✅ PERUBAHAN: Arahkan ke Dashboard Utama (/)
        
      } catch (error) {
        console.error(error);
        // Tangani error dari Laravel (misal: email sudah dipakai)
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setServerError('Terjadi kesalahan pada server. Pastikan backend menyala.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Buat Akun Baru</h2>
        <p className="subtitle">Bergabung dengan BookSales sekarang</p>
        
        {serverError && <div className="alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange} 
              placeholder="Masukkan nama lengkap"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name[0] || errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange} 
              placeholder="contoh@email.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email[0] || errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" name="username" value={formData.username} onChange={handleChange} 
              placeholder="Pilih username unik"
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username[0] || errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" name="password" value={formData.password} onChange={handleChange} 
              placeholder="Minimal 6 karakter"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password[0] || errors.password}</span>}
          </div>

          <button type="submit" disabled={isLoading} className="btn-register">
            {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="footer-link">
          Sudah punya akun? <Link to="/">Kembali ke Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;