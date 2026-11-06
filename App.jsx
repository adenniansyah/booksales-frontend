// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { genreApi, authApi } from './services/api';
import Register from './pages/Register'; 

// --- KOMPONEN DASHBOARD ADMIN
function AdminDashboard() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputName, setInputName] = useState('');
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await genreApi.getAll();
      setGenres(res.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) return alert('Nama tidak boleh kosong!');
    try {
      if (isEditing) {
        await genreApi.update(editId, { name: inputName });
        alert('✅ Data berhasil diupdate!');
      } else {
        await genreApi.create({ name: inputName });
        alert('✅ Data berhasil ditambahkan!');
      }
      setInputName(''); setEditId(null); setIsEditing(false); fetchData();
    } catch (error) {
      alert('❌ Gagal menyimpan data.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus data ini?')) return;
    try {
      await genreApi.delete(id);
      alert('🗑️ Data berhasil dihapus!');
      fetchData();
    } catch (error) {
      alert('❌ Gagal menghapus data.');
    }
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Memuat...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        {/* HEADER & NAVIGASI */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: 0 }}>📚 Book Sales Admin</h1>
          <Link to="/register" style={{ 
            padding: '10px 20px', background: '#4f46e5', color: 'white', 
            borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' 
          }}>
            + Buat Akun Baru
          </Link>
        </div>

        {/* FORM INPUT GENRE */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>{isEditing ? '✏️ Edit Genre' : '➕ Tambah Genre Baru'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
              placeholder="Ketik nama genre..." required
              style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', color: '#111827' }}
            />
            {isEditing ? (
              <>
                <button type="submit" style={{ padding: '14px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Simpan</button>
                <button type="button" onClick={() => {setIsEditing(false); setInputName('');}} style={{ padding: '14px 24px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '10px', cursor: 'pointer' }}>Batal</button>
              </>
            ) : (
              <button type="submit" style={{ padding: '14px 28px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>+ Simpan</button>
            )}
          </form>
        </div>

        {/* LIST DATA GENRE */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #f3f4f6', paddingBottom: '15px' }}>📋 Daftar Genre ({genres.length})</h3>
          {genres.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>Belum ada data genre.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {genres.map((item) => (
                <div key={item.id} style={{ padding: '18px', borderRadius: '12px', border: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '16px' }}>{item.name}</strong>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setInputName(item.name); setEditId(item.id); setIsEditing(true); }} style={{ padding: '8px 16px', background: '#fffbeb', color: '#d97706', border: '1px solid #fef3c7', borderRadius: '8px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', borderRadius: '8px', cursor: 'pointer' }}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// --- KOMPONEN UTAMA APP (ROUTING) ---
function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Utama / Dashboard */}
        <Route path="/" element={<AdminDashboard />} />
        
        {/* Halaman Registrasi (Tugas Baru) */}
        <Route path="/register" element={<Register />} />
        
        {/* Fallback jika route tidak ditemukan */}
        <Route path="*" element={<div style={{textAlign:'center',padding:'100px'}}><h2>Halaman Tidak Ditemukan</h2><Link to="/">Kembali ke Dashboard</Link></div>} />
      </Routes>
    </Router>
  );
}

export default App;