import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Nama lengkap wajib diisi";
    if (!formData.email) tempErrors.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Format email tidak valid";
    if (!formData.username) tempErrors.username = "Username wajib diisi";
    if (!formData.password) tempErrors.password = "Password wajib diisi";
    else if (formData.password.length < 6) tempErrors.password = "Password minimal 6 karakter";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.username);
      navigate('/'); 
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setServerError(error.response?.data?.message || 'Gagal mendaftar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Buat Akun Baru 🚀</h2>
        <p style={styles.subtitle}>Bergabung dengan BookSales sekarang</p>
        
        {serverError && <div style={styles.alertError}>{serverError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nama Lengkap</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama lengkap" style={{...styles.input, ...(errors.name ? styles.inputError : {})}} />
            {errors.name && <span style={styles.errorText}>{Array.isArray(errors.name) ? errors.name[0] : errors.name}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contoh@email.com" style={{...styles.input, ...(errors.email ? styles.inputError : {})}} />
            {errors.email && <span style={styles.errorText}>{Array.isArray(errors.email) ? errors.email[0] : errors.email}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Pilih username unik" style={{...styles.input, ...(errors.username ? styles.inputError : {})}} />
            {errors.username && <span style={styles.errorText}>{Array.isArray(errors.username) ? errors.username[0] : errors.username}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimal 6 karakter" style={{...styles.input, ...(errors.password ? styles.inputError : {})}} />
            {errors.password && <span style={styles.errorText}>{Array.isArray(errors.password) ? errors.password[0] : errors.password}</span>}
          </div>

          <button type="submit" disabled={isLoading} style={styles.btn}>
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p style={styles.footer}>Sudah punya akun? <Link to="/login" style={styles.link}>Masuk disini</Link></p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f5' },
  card: { width: '100%', maxWidth: 450, padding: '2.5rem', background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
  title: { fontSize: '1.8rem', marginBottom: '0.5rem', color: '#212529', textAlign: 'center' },
  subtitle: { color: '#868e96', marginBottom: '2rem', textAlign: 'center', fontSize: '0.95rem' },
  alertError: { background: '#fff5f5', color: '#e03131', padding: '12px', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.9rem', fontWeight: 600, color: '#495057' },
  input: { padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: 8, fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' },
  inputError: { borderColor: '#e03131', backgroundColor: '#fff5f5' },
  errorText: { color: '#e03131', fontSize: '0.8rem', marginTop: '0.25rem' },
  btn: { padding: '14px', background: '#1971c2', color: '#fff', border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
  footer: { marginTop: '2rem', textAlign: 'center', color: '#868e96', fontSize: '0.9rem' },
  link: { color: '#1971c2', textDecoration: 'none', fontWeight: 600 }
};