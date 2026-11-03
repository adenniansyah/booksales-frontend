// src/App.jsx
import { useState, useEffect } from 'react'
import api from './services/api'

function App() {
  // --- STATE MANAGEMENT ---
  const [genres, setGenres] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State untuk form input Create Data
  const [newGenreName, setNewGenreName] = useState('')
  const [newAuthorName, setNewAuthorName] = useState('')

  // --- FITUR READ DATA (Diperbaiki untuk format Laravel) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreRes = await api.get('/genres')
        const authorRes = await api.get('/authors')
        
        // ✅ PERBAIKAN PENTING: Ambil data dari response.data.data
        // Karena Laravel mengembalikan {status:"success", data:[...]}
        setGenres(genreRes.data.data || []) 
        setAuthors(authorRes.data.data || [])
        
      } catch (error) {
        console.error("Gagal mengambil data:", error)
        alert("Terjadi kesalahan saat memuat data! Pastikan backend berjalan.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // --- FUNGSI CREATE DATA GENRE ---
  const handleAddGenre = async (e) => {
    e.preventDefault() 
    
    try {
      await api.post('/genres', { name: newGenreName })
      alert('✅ Genre berhasil ditambahkan!')
      setNewGenreName('') 
      
      // Refresh data setelah add
      const res = await api.get('/genres')
      setGenres(res.data.data || []) // ✅ Gunakan .data.data lagi
      
    } catch (error) {
      console.error(error)
      alert('❌ Gagal menambahkan genre.')
    }
  }

  // --- FUNGSI CREATE DATA AUTHOR ---
  const handleAddAuthor = async (e) => {
    e.preventDefault()
    
    try {
      await api.post('/authors', { name: newAuthorName })
      alert('✅ Author berhasil ditambahkan!')
      setNewAuthorName('')
      
      const res = await api.get('/authors')
      setAuthors(res.data.data || []) // ✅ Gunakan .data.data lagi
      
    } catch (error) {
      console.error(error)
      alert('❌ Gagal menambahkan author.')
    }
  }

  // --- TAMPILAN UI ---
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px' }}>⏳ Sedang memuat data...</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2c3e50', borderBottom: '3px solid #3498db', paddingBottom: '10px' }}>
        📚 Admin Dashboard - Book Sales
      </h1>

      {/* SECTION GENRE */}
      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #dee2e6' }}>
        <h2 style={{ color: '#e67e22' }}>🏷️ Manajemen Genre</h2>
        
        {/* Form Create Genre */}
        <form onSubmit={handleAddGenre} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            placeholder="Masukkan nama genre baru..."
            required
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Tambah Genre
          </button>
        </form>

        {/* List Read Genre */}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {genres.length === 0 ? <p>Belum ada data genre.</p> : 
            genres.map((genre) => (
              <li key={genre.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <span>{genre.name}</span>
                <small style={{ color: '#7f8c8d' }}>ID: {genre.id}</small>
              </li>
            ))
          }
        </ul>
      </div>

      {/* SECTION AUTHOR */}
      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h2 style={{ color: '#2980b9' }}>✍️ Manajemen Author</h2>
        
        {/* Form Create Author */}
        <form onSubmit={handleAddAuthor} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            value={newAuthorName}
            onChange={(e) => setNewAuthorName(e.target.value)}
            placeholder="Masukkan nama author baru..."
            required
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Tambah Author
          </button>
        </form>

        {/* List Read Author */}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {authors.length === 0 ? <p>Belum ada data author.</p> : 
            authors.map((author) => (
              <li key={author.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <span>{author.name}</span>
                <small style={{ color: '#7f8c8d' }}>ID: {author.id}</small>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default App