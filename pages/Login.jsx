import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password); 
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Selamat Datang Kembali 👋</h2>
        <p style={styles.desc}>Masuk untuk mengakses akun BookSales Anda</p>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input 
              id="email" name="email" type="email" 
              value={email} onChange={(e) => setEmail(e.target.value)} 
              required style={styles.input} placeholder="nama@email.com"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input 
              id="password" name="password" type="password" 
              value={password} onChange={(e) => setPassword(e.target.value)} 
              required style={styles.input} placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} style={{
            ...styles.btn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Sedang Memproses...' : 'Masuk ke Akun'}
          </button>
        </form>

        <p style={styles.footer}>
          Belum punya akun? <Link to="/register" style={styles.link}>Daftar disini</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f5' },
  card: { width: '100%', maxWidth: 400, padding: '2.5rem', background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
  title: { fontSize: '1.8rem', marginBottom: '0.5rem', color: '#212529', textAlign: 'center' },
  desc: { color: '#868e96', marginBottom: '2rem', textAlign: 'center' },
  error: { background: '#fff5f5', color: '#e03131', padding: '12px', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.9rem', fontWeight: 600, color: '#495057' },
  input: { padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: 8, fontSize: '1rem', outline: 'none' },
  btn: { padding: '14px', background: '#1971c2', color: '#fff', border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 'bold', marginTop: '1rem' },
  footer: { marginTop: '2rem', textAlign: 'center', color: '#868e96', fontSize: '0.9rem' },
  link: { color: '#1971c2', textDecoration: 'none', fontWeight: 600 }
};