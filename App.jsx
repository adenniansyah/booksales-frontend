// src/App.jsx
import { useState, useEffect } from 'react'
import { genreApi, authorApi } from './services/api'

function App() {
  // --- STATE MANAGEMENT ---
  const [genres, setGenres] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State Form Input
  const [inputName, setInputName] = useState('')
  const [activeTab, setActiveTab] = useState('genre') 
  
  // State untuk Edit Mode
  const [editId, setEditId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // --- FITUR READ DATA ---
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [genreRes, authorRes] = await Promise.all([
        genreApi.getAll(),
        authorApi.getAll()
      ])
      
      setGenres(genreRes.data.data || []) 
      setAuthors(authorRes.data.data || [])
      
    } catch (error) {
      console.error("Gagal mengambil data:", error)
      alert("Terjadi kesalahan saat memuat data! Pastikan backend berjalan.")
    } finally {
      setLoading(false)
    }
  }

  // --- FUNGSI CREATE & UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputName.trim()) return alert('Nama tidak boleh kosong!')

    try {
      if (isEditing) {
        if (activeTab === 'genre') {
          await genreApi.update(editId, { name: inputName })
        } else {
          await authorApi.update(editId, { name: inputName })
        }
        alert(`✅ Data ${activeTab} berhasil diupdate!`)
      } else {
        if (activeTab === 'genre') {
          await genreApi.create({ name: inputName })
        } else {
          await authorApi.create({ name: inputName })
        }
        alert(`✅ Data ${activeTab} berhasil ditambahkan!`)
      }
      
      setInputName('')
      setEditId(null)
      setIsEditing(false)
      fetchData() 
      
    } catch (error) {
      console.error(error)
      alert('❌ Gagal menyimpan data.')
    }
  }

  // --- FUNGSI PREPARE EDIT ---
  const handleEditClick = (item) => {
    setInputName(item.name)
    setEditId(item.id)
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll ke atas otomatis saat edit
  }

  // --- FUNGSI DELETE ---
  const handleDelete = async (id, type) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data ${type} ini?`)) return

    try {
      if (type === 'genre') {
        await genreApi.delete(id)
      } else {
        await authorApi.delete(id)
      }
      alert('🗑️ Data berhasil dihapus secara permanen!')
      fetchData()
    } catch (error) {
      console.error(error)
      alert('❌ Gagal menghapus data.')
    }
  }

  const cancelEdit = () => {
    setInputName('')
    setEditId(null)
    setIsEditing(false)
  }

  // --- TAMPILAN UI (DESIGN MODERN & FIXED INPUT) ---
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f3f4f6', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '5px solid #e5e7eb', borderTop: '5px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Memuat Dashboard...</p>
        </div>
      </div>
    )
  }

  const activeData = activeTab === 'genre' ? genres : authors
  const typeName = activeTab === 'genre' ? 'Genre' : 'Author'

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f3f4f6', 
      padding: '40px 20px', 
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: '#1f2937'
    }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
            📚 Book Sales Admin
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Kelola data Genre dan Author dengan mudah</p>
        </div>

        {/* TAB NAVIGASI MODERN */}
        <div style={{ 
          display: 'flex', 
          background: 'white', 
          padding: '6px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          marginBottom: '30px'
        }}>
          <button 
            onClick={() => { setActiveTab('genre'); cancelEdit(); }}
            style={{ 
              flex: 1, padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.3s',
              background: activeTab === 'genre' ? '#4f46e5' : 'transparent',
              color: activeTab === 'genre' ? 'white' : '#6b7280',
              boxShadow: activeTab === 'genre' ? '0 4px 6px rgba(79, 70, 229, 0.2)' : 'none'
            }}
          >
            🏷️ Manajemen Genre
          </button>
          <button 
            onClick={() => { setActiveTab('author'); cancelEdit(); }}
            style={{ 
              flex: 1, padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.3s',
              background: activeTab === 'author' ? '#4f46e5' : 'transparent',
              color: activeTab === 'author' ? 'white' : '#6b7280',
              boxShadow: activeTab === 'author' ? '0 4px 6px rgba(79, 70, 229, 0.2)' : 'none'
            }}
          >
            ✍️ Manajemen Author
          </button>
        </div>

        {/* CARD FORM INPUT */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '16px', 
          marginBottom: '30px', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          border: isEditing ? '2px solid #4f46e5' : '1px solid #e5e7eb',
          transition: 'all 0.3s ease'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', color: isEditing ? '#4f46e5' : '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isEditing ? '✏️ Mode Edit Data' : `➕ Tambah ${typeName} Baru`}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* ✅ INPUT YANG SUDAH DIPERBAIKI WARNA NYA */}
            <input 
              type="text" 
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={`Ketik nama ${typeName.toLowerCase()} di sini...`}
              required
              style={{ 
                flex: 1, 
                minWidth: '200px', 
                padding: '14px 18px', 
                borderRadius: '10px', 
                border: '1px solid #d1d5db', 
                
                // PERBAIKAN WARNA DI SINI
                color: '#111827',           // Warna teks DIPAKSA gelap (hitam pekat)
                background: '#ffffff',      // Background DIPAKSA putih agar kontras
                
                fontSize: '15px', 
                outline: 'none',
                transition: 'all 0.2s',
                fontWeight: '500'           // Sedikit menebalkan huruf agar lebih jelas
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            
            {isEditing ? (
              <>
                <button type="submit" style={{ padding: '14px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                  💾 Simpan Perubahan
                </button>
                <button type="button" onClick={cancelEdit} style={{ padding: '14px 24px', background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                  Batal
                </button>
              </>
            ) : (
              <button type="submit" style={{ padding: '14px 28px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
                + Simpan Data
              </button>
            )}
          </form>
        </div>

        {/* CARD LIST DATA */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '16px', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>📋 Daftar {typeName}</h3>
            <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
              Total: {activeData.length} Data
            </span>
          </div>
          
          {activeData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
              <p style={{ fontSize: '40px', margin: '0 0 10px' }}>📭</p>
              <p>Belum ada data {typeName.toLowerCase()} yang tersimpan.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeData.map((item) => (
                <div key={item.id} style={{ 
                  padding: '18px 20px', 
                  borderRadius: '12px', 
                  border: editId === item.id ? '2px solid #4f46e5' : '1px solid #f3f4f6',
                  background: editId === item.id ? '#eef2ff' : 'white',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: editId === item.id ? '0 4px 12px rgba(79, 70, 229, 0.1)' : 'none'
                }}>
                  <div>
                    <strong style={{ fontSize: '16px', color: '#111827', display: 'block', marginBottom: '4px' }}>{item.name}</strong>
                    <small style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '500' }}>ID: #{item.id}</small>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleEditClick(item)}
                      style={{ padding: '10px 16px', background: '#fffbeb', color: '#d97706', border: '1px solid #fef3c7', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      ✏️ Edit
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(item.id, activeTab)}
                      style={{ padding: '10px 16px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      
      {/* CSS Animation for Spinner */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        button:hover { opacity: 0.9; transform: translateY(-1px); }
        button:active { transform: translateY(0); }
      `}</style>
    </div>
  )
}

export default App