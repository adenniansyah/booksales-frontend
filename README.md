# 📚 BookSales Platform | React JS & Laravel Fullstack

> Aplikasi manajemen penjualan buku modern dengan sistem otentikasi JWT, Role-Based Access Control (RBAC), dan fitur e-commerce terintegrasi.

## ✨ Fitur Utama

-   🔐 **Sistem Autentikasi Aman**: Login & Register menggunakan JWT (JSON Web Token) dengan interceptor Axios otomatis.
-   🛡️ **Role-Based Access Control (RBAC)**: Pembagian hak akses ketat antara Administrator dan Customer menggunakan Protected Routes & Context API.
-   🛒 **E-Commerce Experience**: Fitur keranjang belanja dinamis, checkout multi-item, dan simulasi pembayaran lengkap.
-   📊 **Dashboard Interaktif**: Panel admin real-time untuk memantau pesanan, mengelola katalog, dan analisis transaksi.
-   🎨 **Modern UI/UX**: Desain antarmuka yang bersih, responsif, dan user-friendly menggunakan inline styling yang konsisten.

## 🛠️ Tech Stack

| Kategori       | Teknologi                  |
| :------------- | :------------------------- |
| **Frontend**   | React JS, Vite, React Router v6, Context API, Axios |
| **Backend**    | Laravel 12, PHP 8.4, MySQL |
| **Auth**       | Tymon JWT Auth             |
| **Styling**    | Inline Styles (CSS-in-JS)  |
| **Tools**      | Git, VS Code, Postman      |

## 🚀 Cara Menjalankan Project

### 1. Backend (Laravel)
```bash
cd booksales-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve

2. Frontend
cd booksales-frontend
npm install
npm run dev

👤 Akun Testing Default
Setelah menjalankan seeder, gunakan akun berikut untuk testing RBAC:
Role
Email
Password
Admin
admin@booksales.com
123456
User
user@booksales.com
123456

📂 Struktur Folder Frontend
src/
├── components/     # Komponen reusable (ProtectedRoute)
├── context/        # Global state management (AuthContext)
├── pages/          # Halaman utama (Home, Login, Dashboard, dll)
└── services/       # Konfigurasi API & Axios Interceptors
