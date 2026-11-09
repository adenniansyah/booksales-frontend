import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionApi } from '../services/api';

export default function DashboardUser() {
  const { user } = useAuth();
  
  const [view, setView] = useState('catalog'); 
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState('');
  
  const books = [
    { id: 1, title: 'Atomic Habits', author: 'James Clear', price: 95000, color: '#3b82f6' },
    { id: 2, title: 'Filosofi Teras', author: 'Henry Manampiring', price: 89000, color: '#10b981' },
    { id: 3, title: 'Laut Bercerita', author: 'Leila S. Chudori', price: 105000, color: '#f43f5e' },
    { id: 4, title: 'Bumi Manusia', author: 'Pramoedya A. Toer', price: 120000, color: '#f59e0b' },
    { id: 5, title: 'Psychology of Money', author: 'Morgan Housel', price: 85000, color: '#8b5cf6' },
    { id: 6, title: 'Dunia Sophie', author: 'Jostein Gaarder', price: 110000, color: '#ec4899' },
  ];

  const formatRupiah = (num) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const addToCart = (book) => {
    const existing = cart.find(item => item.id === book.id);
    if (existing) {
      setCart(cart.map(item => item.id === book.id ? {...item, qty: item.qty + 1} : item));
    } else {
      setCart([...cart, {...book, qty: 1}]);
    }
    showNotif(`"${book.title}" ditambahkan ke keranjang!`);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return {...item, qty: newQty};
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalCart = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setView('checkout');
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const response = await transactionApi.create({
        total_amount: totalCart,
        payment_method: formData.get('paymentMethod'),
        shipping_address: formData.get('address'),
        items: cart.map(item => ({ 
          id: item.id, 
          title: item.title, 
          qty: item.qty, 
          price: item.price 
        }))
      });

      const newOrder = {
        id: `ORD-${response.data.data.id}`,
        date: new Date().toLocaleDateString('id-ID'),
        items: [...cart],
        total: totalCart,
        method: formData.get('paymentMethod'),
        address: formData.get('address'),
        status: 'Menunggu Pembayaran'
      };

      setOrders([newOrder, ...orders]);
      setCart([]);
      setView('success');
      showNotif('Pembayaran Berhasil! Pesanan Anda sedang diproses.');
      
    } catch (error) {
      console.error("Gagal checkout:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    }
  };

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  if (view === 'catalog') {
    return (
      <div style={styles.container}>
        {notification && <div style={styles.toast}>{notification}</div>}
        
        <header style={styles.header}>
          <div>
            <h1 style={styles.greeting}>Halo, {user?.name}! 👋</h1>
            <p style={styles.subGreeting}>Temukan buku favoritmu hari ini.</p>
          </div>
          <button onClick={() => setView('cart')} style={styles.cartBtn}>
            🛒 Keranjang ({cart.reduce((a,b)=>a+b.qty,0)})
          </button>
        </header>

        <h2 style={styles.sectionTitle}>Rekomendasi Untukmu</h2>
        <div style={styles.grid}>
          {books.map((book) => (
            <div key={book.id} style={styles.card}>
              <div style={{...styles.bookCover, background: `${book.color}15`, color: book.color}}>📖</div>
              <div style={styles.cardContent}>
                <h3 style={styles.bookTitle}>{book.title}</h3>
                <p style={styles.bookAuthor}>{book.author}</p>
                <div style={styles.priceRow}>
                  <span style={styles.price}>{formatRupiah(book.price)}</span>
                  <button onClick={() => addToCart(book)} style={styles.addBtn}>+ Keranjang</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'cart') {
    return (
      <div style={styles.container}>
        <button onClick={() => setView('catalog')} style={styles.backBtn}>← Kembali ke Katalog</button>
        <h2 style={styles.sectionTitle}>Keranjang Belanja Anda</h2>
        
        {cart.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Keranjang masih kosong. Yuk belanja!</p>
            <button onClick={() => setView('catalog')} style={styles.primaryBtn}>Mulai Belanja</button>
          </div>
        ) : (
          <div style={styles.cartLayout}>
            <div style={styles.cartItems}>
              {cart.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <div style={styles.itemInfo}>
                    <h4>{item.title}</h4>
                    <p>{formatRupiah(item.price)}</p>
                  </div>
                  <div style={styles.itemActions}>
                    <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}>-</button>
                    <span style={styles.qtyText}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.cartSummary}>
              <h3>Ringkasan Belanja</h3>
              <div style={styles.summaryRow}>
                <span>Total Item</span>
                <span>{cart.reduce((a,b)=>a+b.qty,0)} Buku</span>
              </div>
              <div style={{...styles.summaryRow, fontWeight:'bold', fontSize:'1.2rem', borderTop:'1px solid #eee', paddingTop:'1rem'}}>
                <span>Total Bayar</span>
                <span style={{color:'#2563eb'}}>{formatRupiah(totalCart)}</span>
              </div>
              <button onClick={handleCheckout} style={styles.checkoutBtn}>Lanjut ke Pembayaran →</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'checkout') {
    return (
      <div style={styles.container}>
        <button onClick={() => setView('cart')} style={styles.backBtn}>← Kembali ke Keranjang</button>
        <div style={styles.checkoutLayout}>
          <form onSubmit={handlePayment} style={styles.checkoutForm}>
            <h2 style={styles.sectionTitle}>Informasi Pengiriman</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Alamat Lengkap</label>
              <textarea name="address" required rows="3" style={styles.input} placeholder="Jl. Contoh No. 123, Jakarta..."></textarea>
            </div>
            
            <h2 style={{...styles.sectionTitle, marginTop:'2rem'}}>Metode Pembayaran</h2>
            <div style={styles.paymentOptions}>
              <label style={styles.paymentCard}>
                <input type="radio" name="paymentMethod" value="BCA" defaultChecked style={{marginRight:8}} />
                <div>
                  <strong>Transfer Bank BCA</strong>
                  <p style={{fontSize:'0.8rem', color:'#666'}}>Virtual Account: 8806-0812-3456-7890</p>
                </div>
              </label>
              <label style={styles.paymentCard}>
                <input type="radio" name="paymentMethod" value="MANDIRI" style={{marginRight:8}} />
                <div>
                  <strong>Transfer Bank Mandiri</strong>
                  <p style={{fontSize:'0.8rem', color:'#666'}}>Virtual Account: 8901-2345-6789-0123</p>
                </div>
              </label>
              <label style={styles.paymentCard}>
                <input type="radio" name="paymentMethod" value="GOPAY" style={{marginRight:8}} />
                <div>
                  <strong>E-Wallet (GoPay/OVO)</strong>
                  <p style={{fontSize:'0.8rem', color:'#666'}}>Scan QRIS saat konfirmasi</p>
                </div>
              </label>
            </div>

            <div style={styles.totalSection}>
              <span>Total Tagihan:</span>
              <span style={{fontSize:'1.5rem', fontWeight:'bold', color:'#2563eb'}}>{formatRupiah(totalCart)}</span>
            </div>
            
            <button type="submit" style={styles.payBtn}>Bayar Sekarang 🔒</button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✅</div>
          <h2>Pembayaran Berhasil!</h2>
          <p>Terima kasih telah berbelanja di BookSales.</p>
          <button onClick={() => setView('catalog')} style={styles.primaryBtn}>Kembali Belanja</button>
        </div>

        <h2 style={styles.sectionTitle}>Riwayat Pesanan Terakhir</h2>
        <div style={styles.orderList}>
          {orders.map(order => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <span style={{fontWeight:'bold'}}>#{order.id}</span>
                <span style={{color:'#10b981', fontWeight:'bold'}}>{order.status}</span>
              </div>
              <p style={{fontSize:'0.9rem', color:'#666'}}>{order.date} • {order.method}</p>
              <div style={styles.orderItems}>
                {order.items.map(i => <span key={i.id} style={styles.orderItemTag}>{i.title} (x{i.qty})</span>)}
              </div>
              <div style={styles.orderTotal}>Total: {formatRupiah(order.total)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const styles = {
  container: { padding: '2rem', maxWidth: 1000, margin: '0 auto', minHeight: '80vh' },
  toast: { position: 'fixed', top: 20, right: 20, background: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: 8, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  greeting: { fontSize: '2rem', color: '#1e293b', margin: 0 },
  subGreeting: { color: '#64748b', marginTop: '0.5rem' },
  cartBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  sectionTitle: { fontSize: '1.5rem', color: '#1e293b', marginBottom: '1.5rem', marginTop: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' },
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
  bookCover: { height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' },
  cardContent: { padding: '1.5rem' },
  bookTitle: { margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#1e293b' },
  bookAuthor: { margin: '0 0 1rem', color: '#64748b', fontSize: '0.9rem' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '1.1rem', fontWeight: 'bold', color: '#2563eb' },
  addBtn: { background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: '600' },
  backBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem' },
  emptyState: { textAlign: 'center', padding: '4rem 0', color: '#64748b' },
  primaryBtn: { background: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', marginTop: '1rem', fontWeight: 'bold' },
  cartLayout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' },
  cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #f1f5f9' },
  itemInfo: { flex: 1 },
  itemActions: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { width: 30, height: 30, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' },
  qtyText: { fontWeight: 'bold', minWidth: 20, textAlign: 'center' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' },
  cartSummary: { background: '#f8fafc', padding: '1.5rem', borderRadius: 12, height: 'fit-content', border: '1px solid #e2e8f0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#475569' },
  checkoutBtn: { width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem' },
  checkoutForm: { background: '#fff', padding: '2rem', borderRadius: 16, border: '1px solid #e2e8f0' },
  formGroup: { marginBottom: '1.5rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' },
  input: { width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' },
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  paymentCard: { display: 'flex', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', background: '#fff' },
  totalSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0', padding: '1rem 0', borderTop: '2px dashed #e2e8f0' },
  payBtn: { width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '16px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' },
  successBox: { textAlign: 'center', padding: '3rem', background: '#f0fdf4', borderRadius: 16, border: '1px solid #bbf7d0', marginBottom: '3rem' },
  successIcon: { fontSize: '4rem', marginBottom: '1rem' },
  orderList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  orderCard: { background: '#fff', padding: '1.5rem', borderRadius: 12, border: '1px solid #e2e8f0' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
  orderItems: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' },
  orderItemTag: { background: '#f1f5f9', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', color: '#475569' },
  orderTotal: { textAlign: 'right', fontWeight: 'bold', color: '#1e293b', marginTop: '1rem' }
};