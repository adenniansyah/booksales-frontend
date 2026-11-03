Book Sales Frontend - Admin Dashboard
Proyek ini merupakan implementasi Tugas 1 React JS Lanjutan yang berfokus pada pengembangan fitur CRUD (Create & Read) untuk entitas Genre dan Author pada halaman Admin aplikasi Book Sales.
🚀 Fitur Utama
Read Data: Mengambil dan menampilkan daftar Genre serta Author secara otomatis saat halaman dimuat menggunakan teknik asynchronous.
Create Data: Form input dinamis untuk menambahkan data Genre dan Author baru ke server tanpa me-reload halaman (Single Page Application).
Real-time Update: Tampilan daftar data diperbarui secara instan setelah data berhasil ditambahkan.
🛠️ Teknologi & Konsep
Sesuai dengan modul pembelajaran, proyek ini menerapkan best practice berikut:
React Hooks: Menggunakan useState untuk manajemen state lokal dan useEffect untuk side effects (fetching data awal).
Axios Library: Digunakan untuk melakukan HTTP Request (GET dan POST) ke API Backend Laravel dengan penanganan Promise yang lebih baik dibanding Fetch API standar.
Async/Await: Implementasi kode asynchronous yang bersih dan mudah dibaca untuk menangani operasi jaringan.
Error Handling: Penggunaan blok try-catch untuk memastikan aplikasi tetap stabil jika terjadi kegagalan koneksi atau error server.
CORS Configuration: Konfigurasi Cross-Origin Resource Sharing di sisi backend (Laravel 11) untuk mengizinkan komunikasi aman antara frontend (Vite) dan backend.
📂 Struktur Proyek Penting
src/App.jsx: Komponen utama yang berisi logika UI, state management, dan handler fungsi CRUD.
src/services/api.js: Konfigurasi instance Axios terpusat untuk baseURL API.
