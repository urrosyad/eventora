# Eventora Backend RESTful API

Selamat datang di backend system **Eventora** — Digital Sponsorship Management Platform. Backend ini dikembangkan menggunakan **Laravel 12 (compatible dengan PHP 8.2+ dan Laravel 11 patterns)** dengan standard arsitektur Enterprise, memanfaatkan **Repository Pattern**, **Service Layer**, **FormRequest Validation**, dan **JWT Authentication** (bukan Sanctum).

---

## 🚀 Tech Stack & Setup
- **Framework:** Laravel 12 / PHP 8.2+
- **Database:** MySQL 8.x
- **Autentikasi:** PHPOpenSourceSaver JWT (JSON Web Token)
- **API Documentation:** Swagger / L5-Swagger

---

## 🛠️ Langkah Instalasi Mandiri

### 1. Kloning & Masuk ke Folder Backend
Jika belum berada di folder, pastikan Anda berada di folder `backend/`:
```bash
cd backend
```

### 2. Install Dependency PHP
Unduh semua PHP packages yang dibutuhkan (termasuk PHPOpenSourceSaver JWT & L5-Swagger):
```bash
composer install
```

### 3. Duplikasi File `.env` & Generate Key
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Konfigurasi Database di `.env`
Sesuaikan kredensial database lokal (misal XAMPP MySQL):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eventora
DB_USERNAME=root
DB_PASSWORD=
```
*Catatan: Pastikan Anda telah membuat database kosong bernama `eventora` di phpMyAdmin / MySQL.*

### 5. Generate JWT Secret Key
Generate token sign key untuk autentikasi JWT:
```bash
php artisan jwt:secret
```

### 6. Jalankan Migration & Seeding
Jalankan migrasi database beserta data awal (termasuk akun uji coba):
```bash
php artisan migrate --seed
```

### 7. Hubungkan Storage Link
Gunakan storage link agar proposal PDF dan logo dapat diakses secara publik:
```bash
php artisan storage:link
```

### 8. Jalankan Local Server
```bash
php artisan serve
```
Aplikasi backend akan berjalan di: `http://127.0.0.1:8000`

---

## 📘 Dokumentasi Swagger API
Dokumentasi interaktif Swagger API terintegrasi secara otomatis. Anda dapat melakukan pengujian endpoint (Try it out) secara langsung di browser.

- **URL Akses:** [http://127.0.0.1:8000/api/documentation](http://127.0.0.1:8000/api/documentation)
- **Re-generate Docs (Opsional):** Jika mengubah dokumentasi, jalankan:
  ```bash
  php artisan l5-swagger:generate
  ```

---

## 👥 Akun Uji Coba (Seeded Users)
Gunakan kredensial berikut untuk menguji API di Swagger / Postman:

| No | Role | Email | Password | Keterangan |
|---|---|---|---|---|
| 1 | **Admin** | `admin@eventora.com` | `password123` | Akses penuh dashboard admin |
| 2 | **Organisasi** | `organisasi@eventora.com` | `password123` | Telah melengkapi biodata profil |
| 3 | **Perusahaan** | `perusahaan@eventora.com` | `password123` | Telah melengkapi profil & tipe dukungan |

---


## 📂 Struktur Folder Architecture
```text
backend/
├── app/
│   ├── Docs/                 # Centralized Swagger API Attributes
│   ├── Http/
│   │   ├── Controllers/      # Handles HTTP Requests & standard JSON outputs
│   │   ├── Middleware/       # Role-Based RBAC & Account Active checks
│   │   ├── Requests/         # FormRequest validations
│   │   └── Resources/        # API Response format mapping
│   ├── Models/               # Eloquent Models & casts for preferences
│   ├── Repositories/         # Database Query Abstraction Layer
│   ├── Services/             # Business Logic Layer
│   └── Traits/               # Shared traits (e.g., ApiResponse)
├── bootstrap/
│   └── app.php               # Middleware & API routes binding
├── config/                   # Configuration files (auth, jwt, l5-swagger)
├── database/
│   ├── migrations/           # Normalized database tables
│   └── seeders/              # Database Seeder classes
└── routes/
    └── api.php               # Mapped RESTful API routes
```
