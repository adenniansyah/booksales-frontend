import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, isAdmin } = useAuth();
  if (!user) return <div style={{padding: 50}}>Memuat profil...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <h2 style={styles.name}>{user.name}</h2>
          <span style={isAdmin ? styles.badgeAdmin : styles.badgeUser}>
            {isAdmin ? '👑 Administrator' : '👤 Pengguna Biasa'}
          </span>
        </div>
      </div>

      <div style={styles.infoCard}>
        <h3 style={styles.cardTitle}>Informasi Akun</h3>
        <div style={styles.row}>
          <span style={styles.label}>Email Address</span>
          <span style={styles.value}>{user.email}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Username</span>
          <span style={styles.value}>@{user.username}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Terdaftar Sejak</span>
          <span style={styles.value}>{new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Status Akun</span>
          <span style={{...styles.value, color: '#10b981', fontWeight: 'bold'}}>Aktif ✅</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '3rem auto', padding: '0 1rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' },
  avatar: { width: 80, height: 80, background: '#2563eb', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' },
  name: { margin: 0, fontSize: '2rem', color: '#1e293b' },
  badgeAdmin: { background: '#fef2f2', color: '#dc2626', padding: '6px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #fecaca' },
  badgeUser: { background: '#f0fdf4', color: '#16a34a', padding: '6px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #bbf7d0' },
  infoCard: { background: '#fff', padding: '2rem', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
  cardTitle: { margin: '0 0 1.5rem', fontSize: '1.2rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f8fafc' },
  label: { color: '#64748b', fontWeight: 500, fontSize: '0.95rem' },
  value: { color: '#1e293b', fontWeight: 600, fontSize: '0.95rem' }
};