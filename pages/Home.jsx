import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>📚 BookSales Platform</h1>
        <p style={styles.subtitle}>
          Temukan buku favoritmu atau kelola toko bukumu dalam satu platform terintegrasi.
        </p>
        
        <div style={styles.buttonGroup}>
          {isAuthenticated ? (
            <Link to="/profile" style={styles.primaryBtn}>Lanjutkan ke Profil</Link>
          ) : (
            <>
              <Link to="/login" style={styles.primaryBtn}>Masuk Sekarang</Link>
              <Link to="/register" style={styles.secondaryBtn}>Daftar Akun</Link>
            </>
          )}
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.card}>
          <h3>🔍 Katalog Lengkap</h3>
          <p>Ribuan judul buku dari berbagai genre tersedia.</p>
        </div>
        <div style={styles.card}>
          <h3>🛡️ Transaksi Aman</h3>
          <p>Sistem pembayaran dan riwayat yang terjamin keamanannya.</p>
        </div>
        <div style={styles.card}>
          <h3>⚡ Dashboard Cepat</h3>
          <p>Manajemen stok dan penjualan dalam hitungan detik.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '85vh', padding: '4rem 2rem', textAlign: 'center', background: '#ffffff' },
  hero: { maxWidth: 700, margin: '0 auto 5rem' },
  title: { fontSize: '3.5rem', marginBottom: '1.5rem', color: '#1e293b', fontWeight: '800', letterSpacing: '-1px', lineHeight: '1.1' },
  subtitle: { fontSize: '1.25rem', color: '#64748b', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2.5rem' },
  buttonGroup: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: { padding: '14px 28px', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' },
  secondaryBtn: { padding: '14px 28px', background: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' },
  features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' },
  card: { padding: '2.5rem 2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }
};