import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardUser from './pages/DashboardUser';

function Navbar() {
  const { isAuthenticated, isAdmin, logout, user, loading } = useAuth();

  if (loading) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>📚 BookSales</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Beranda</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/profile" style={styles.link}>Profil</Link>
            
            {isAdmin && (
              <Link to="/admin/dashboard" style={{...styles.link, color: '#e03131', fontWeight: 'bold'}}>
                Panel Admin
              </Link>
            )}
            
            {!isAdmin && (
              <Link to="/user/dashboard" style={{...styles.link, color: '#2b8a3e'}}>
                Toko Buku
              </Link>
            )}

            <button onClick={logout} style={styles.logoutBtn}>
              Logout ({user?.name})
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Masuk</Link>
            <Link to="/register" style={styles.btnRegister}>Daftar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin"><DashboardAdmin /></ProtectedRoute>
            } />

            <Route path="/user/dashboard" element={
              <ProtectedRoute requiredRole="customer"><DashboardUser /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #e9ecef',
    position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
  },
  brand: { fontSize: '1.5rem', fontWeight: '800', color: '#1971c2' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#495057', fontWeight: 500 },
  btnRegister: { padding: '8px 20px', background: '#1971c2', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' },
  logoutBtn: { padding: '8px 16px', background: 'transparent', border: '1px solid #dee2e6', borderRadius: '6px', cursor: 'pointer', color: '#868e96', fontSize: '0.9rem' },
  main: { minHeight: 'calc(100vh - 73px)', background: '#f8f9fa' }
};