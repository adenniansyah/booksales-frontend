import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionApi } from '../services/api';

export default function DashboardAdmin() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([
    { id: 1, title: 'Atomic Habits', stock: 50, price: 95000 },
    { id: 2, title: 'Filosofi Teras', stock: 30, price: 89000 },
    { id: 3, title: 'Laut Bercerita', stock: 15, price: 105000 },
  ]);
  const [users, setUsers] = useState([
    { id: 1, name: 'User Pelanggan', email: 'user@booksales.com', role: 'customer', status: 'Aktif' },
    { id: 2, name: 'Budi Santoso', email: 'budi@test.com', role: 'customer', status: 'Aktif' },
  ]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await transactionApi.getAll();
        const formattedOrders = response.data.data.map(order => ({
          id: `ORD-${order.id}`,
          user_name: order.customer?.name || 'Unknown',
          date: new Date(order.created_at).toLocaleDateString('id-ID'),
          total: parseFloat(order.total_amount),
          method: order.payment_method,
          address: order.shipping_address,
          status: order.status,
          items: order.items_data || []
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Gagal ambil data pesanan:", error);
      }
    };
    fetchOrders();
  }, []);

  const formatRupiah = (num) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const deleteOrder = (orderId) => {
    if(window.confirm('Yakin ingin menghapus data pesanan ini?')) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const realId = orderId.replace('ORD-', ''); 
    try {
      await transactionApi.updateStatus(realId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? {...o, status: newStatus} : o));
    } catch (error) {
      alert("Gagal update status");
    }
  };

  const deleteBook = (bookId) => {
    if(window.confirm('Hapus buku ini dari katalog?')) {
      setBooks(books.filter(b => b.id !== bookId));
    }
  };

  const deleteUser = (userId) => {
    if(window.confirm('Hapus user ini?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      return (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, background: '#eff6ff', color: '#3b82f6'}}>📚</div>
              <div><h3 style={styles.statValue}>{books.length}</h3><p style={styles.statLabel}>Total Katalog</p></div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, background: '#ecfdf5', color: '#10b981'}}>💰</div>
              <div><h3 style={styles.statValue}>{formatRupiah(totalRevenue)}</h3><p style={styles.statLabel}>Pendapatan</p></div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, background: '#fffbeb', color: '#f59e0b'}}>📦</div>
              <div><h3 style={styles.statValue}>{orders.length}</h3><p style={styles.statLabel}>Total Pesanan</p></div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, background: '#fef2f2', color: '#ef4444'}}>👥</div>
              <div><h3 style={styles.statValue}>{users.length}</h3><p style={styles.statLabel}>Pengguna Terdaftar</p></div>
            </div>
          </div>
          
          <div style={styles.recentSection}>
            <h3 style={styles.sectionTitle}>Pesanan Masuk Terbaru</h3>
            {orders.length === 0 ? (
              <p style={{color:'#666'}}>Belum ada pesanan masuk.</p>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID Pesanan</th>
                      <th style={styles.th}>Tanggal</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} style={styles.tr}>
                        <td style={styles.td}>#{order.id}</td>
                        <td style={styles.td}>{order.date}</td>
                        <td style={styles.td}>{formatRupiah(order.total)}</td>
                        <td style={styles.td}>
                          <span style={{
                            padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem', fontWeight: 'bold',
                            background: order.status === 'Lunas ✅' ? '#dcfce7' : '#fee2e2',
                            color: order.status === 'Lunas ✅' ? '#166534' : '#991b1b'
                          }}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      );
    }

    if (activeTab === 'orders') {
      return (
        <div>
          <h2 style={styles.sectionTitle}>Manajemen Pesanan ({orders.length})</h2>
          {orders.length === 0 ? (
            <div style={styles.emptyState}>Belum ada data pesanan dari user.</div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Alamat Pengiriman</th>
                    <th style={styles.th}>Metode Bayar</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={styles.tr}>
                      <td style={styles.td}>#{order.id}</td>
                      <td style={styles.td}>{order.address}</td>
                      <td style={styles.td}>{order.method}</td>
                      <td style={styles.td}>{formatRupiah(order.total)}</td>
                      <td style={styles.td}>
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={styles.statusSelect}
                        >
                          <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                          <option value="Lunas ✅">Lunas ✅</option>
                          <option value="Dikirim 🚚">Dikirim 🚚</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => deleteOrder(order.id)} style={styles.dangerBtn}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'books') {
      return (
        <div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
            <h2 style={{...styles.sectionTitle, margin:0}}>Katalog Buku ({books.length})</h2>
            <button style={styles.primaryBtn}>+ Tambah Buku Baru</button>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Judul Buku</th>
                  <th style={styles.th}>Stok</th>
                  <th style={styles.th}>Harga</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} style={styles.tr}>
                    <td style={styles.td}><strong>{book.title}</strong></td>
                    <td style={styles.td}>{book.stock} pcs</td>
                    <td style={styles.td}>{formatRupiah(book.price)}</td>
                    <td style={styles.td}>
                      <button style={{...styles.smallBtn, marginRight:8}}>Edit</button>
                      <button onClick={() => deleteBook(book.id)} style={styles.dangerBtn}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'users') {
      return (
        <div>
          <h2 style={styles.sectionTitle}>Data Pengguna ({users.length})</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nama</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem', fontWeight: 'bold',
                        background: u.role === 'admin' ? '#fef2f2' : '#f0fdf4',
                        color: u.role === 'admin' ? '#dc2626' : '#16a34a'
                      }}>{u.role.toUpperCase()}</span>
                    </td>
                    <td style={styles.td}>{u.status}</td>
                    <td style={styles.td}>
                      <button onClick={() => deleteUser(u.id)} style={styles.dangerBtn}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>🛡️ Admin Panel</div>
        <nav style={styles.nav}>
          <button onClick={() => setActiveTab('overview')} style={activeTab === 'overview' ? styles.activeNav : styles.navItem}>📊 Dashboard</button>
          <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? styles.activeNav : styles.navItem}>📦 Pesanan ({orders.length})</button>
          <button onClick={() => setActiveTab('books')} style={activeTab === 'books' ? styles.activeNav : styles.navItem}>📚 Katalog Buku</button>
          <button onClick={() => setActiveTab('users')} style={activeTab === 'users' ? styles.activeNav : styles.navItem}>👥 Manajemen User</button>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>
            {activeTab === 'overview' && 'Ringkasan Sistem'}
            {activeTab === 'orders' && 'Manajemen Pesanan'}
            {activeTab === 'books' && 'Katalog Buku'}
            {activeTab === 'users' && 'Data Pengguna'}
          </h1>
          <div style={styles.adminProfile}>
            <div style={styles.avatar}>{user?.name.charAt(0)}</div>
            <span>{user?.name}</span>
          </div>
        </header>
        
        <div style={styles.content}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: 'calc(100vh - 70px)', background: '#f8fafc' },
  sidebar: { width: 260, background: '#1e293b', color: '#fff', padding: '1.5rem', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #334155' },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  navItem: { background: 'transparent', border: 'none', color: '#94a3b8', padding: '12px 16px', textAlign: 'left', cursor: 'pointer', borderRadius: 8, fontSize: '0.95rem', transition: '0.2s' },
  activeNav: { background: '#3b82f6', border: 'none', color: '#fff', padding: '12px 16px', textAlign: 'left', cursor: 'pointer', borderRadius: 8, fontSize: '0.95rem', fontWeight: 'bold' },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { background: '#fff', padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { margin: 0, fontSize: '1.5rem', color: '#1e293b' },
  adminProfile: { display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' },
  avatar: { width: 36, height: 36, background: '#3b82f6', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  content: { padding: '2rem', overflowY: 'auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  statCard: { background: '#fff', padding: '1.5rem', borderRadius: 12, display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' },
  statIcon: { width: 50, height: 50, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  statValue: { margin: 0, fontSize: '1.5rem', color: '#1e293b' },
  statLabel: { margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' },
  sectionTitle: { fontSize: '1.2rem', color: '#1e293b', marginBottom: '1rem' },
  tableContainer: { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 600 },
  th: { textAlign: 'left', padding: '1rem', background: '#f8fafc', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '1rem', color: '#334155', fontSize: '0.9rem' },
  statusSelect: { padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' },
  dangerBtn: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
  smallBtn: { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' },
  primaryBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: '600' },
  emptyState: { textAlign: 'center', padding: '4rem', color: '#64748b', background: '#fff', borderRadius: 12, border: '1px dashed #cbd5e1' },
  recentSection: { marginTop: '2rem' }
};