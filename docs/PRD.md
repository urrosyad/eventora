# EVENTORA
## Platform Digital Sponsorship Management System
### Product Requirements Document (PRD) — Version 1.0

| Field | Detail |
|---|---|
| Proyek | Eventora — Sponsorship Management Platform |
| Versi | 1.0 — MVP Release |
| Timeline | 1 Minggu |
| Tim | 3 Orang (FE, BE, Laporan) |
| Tech Stack | Laravel · React · Tailwind CSS · MySQL |

---

# 1. Executive Summary

Platform Digital Sponsorship Management System **Eventora** adalah website full-stack berbasis RESTful API yang menghubungkan organisasi pencari sponsor dengan perusahaan pemberi sponsor dalam satu ekosistem digital yang terpusat, efisien, dan transparan.

## 1.1 Latar Belakang & Masalah

- Proses pencarian sponsor masih dilakukan secara manual melalui email dan pesan pribadi.
- Status pengajuan sponsorship tidak dapat dipantau secara real-time.
- Tidak ada riwayat digital yang terstruktur untuk organisasi maupun perusahaan.
- Perusahaan kesulitan menyeleksi proposal yang tersebar di berbagai media komunikasi.
- Admin atau pengelola platform tidak memiliki sistem monitoring yang terstruktur.

## 1.2 Solusi & Nilai Utama

| Nilai | Deskripsi |
|---|---|
| **Terpusat** | Semua data event, proposal, dan sponsorship dalam satu platform. |
| **Efisien** | Satu proposal dapat diajukan ke banyak perusahaan dengan surat pengantar yang dapat dikustomisasi. |
| **Transparan** | Status sponsorship dapat dipantau secara real-time oleh semua pihak. |
| **Profesional** | Format pengajuan yang rapi, terdokumentasi, dan memiliki alur kerja yang jelas. |
| **Terukur** | Admin dapat memantau statistik dan aktivitas seluruh platform. |

## 1.3 Konsep Inti Sistem

```
1 event = 1 proposal utama (PDF)
1 event = dapat diajukan ke BANYAK perusahaan
setiap pengajuan = dapat memiliki surat pengantar (cover letter) yang berbeda
```

## 1.4 Success Criteria (KPI)

- Semua fitur MVP berjalan lanpa critical bug.
- Ketiga role (Admin, Organisasi, Perusahaan) dapat menggunakan fitur masing-masing.
- RESTful API terdokumentasi dengan Swagger dan dapat diuji via Postman.
- Aplikasi dapat didemo dalam waktu 1 minggu.

---

# 2. Technical Stack & Architecture

## 2.1 Technology Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Frontend | React + Vite | UI framework berbasis component, fast build tool dengan HMR |
| Frontend Architecture | Component Pattern | UI dipecah menjadi reusable components seperti AuthForm, Navbar, Card, Modal, DashboardLayout |
| Styling | Tailwind CSS | Utility-first CSS untuk styling cepat, konsisten, dan responsive |
| Backend | Laravel 11 (PHP) | Backend RESTful API berbasis MVC |
| Backend Architecture | Repository Pattern | Memisahkan business logic dan query database melalui repository layer |
| Auth | JWT Authentication | Autentikasi menggunakan JSON Web Token dengan Bearer Token |
| Authorization | JWT + RBAC Middleware | Otorisasi berbasis role menggunakan middleware admin, organisasi, dan perusahaan |
| Database | MySQL 8.x | Relational database utama |
| File Storage | Laravel Local Storage | Public disk untuk proposal PDF dan logo, maksimal 10MB per file |
| External API | API Wilayah Indonesia | Integrasi provinsi dan kota dari https://wilayah.id/ |
| RESTful API Docs | Swagger / L5-Swagger | Dokumentasi API otomatis dan interaktif |
| Dev Tools | Postman, Git, VS Code | API testing, version control, dan code editor |

## 2.2 Arsitektur Sistem

┌─────────────────────────────────────────────────────────┐
│ CLIENT LAYER │
│ React SPA (Vite + Tailwind) │
│ Component Pattern + Axios HTTP Client │
│ JWT Bearer Token Authentication │
└─────────────────────┬───────────────────────────────────┘
│ HTTP/HTTPS JSON
│ Authorization: Bearer <JWT_TOKEN>
┌─────────────────────▼───────────────────────────────────┐
│ API LAYER (Laravel) │
│ Routes → JWT Auth Middleware → Role Middleware │
│ → Controller → FormRequest → Resource │
│ → Service/Repository Layer │
│ │
│ Authentication: JWT Token │
│ Authorization: RBAC admin | organisasi | perusahaan │
└─────────────────────┬───────────────────────────────────┘
│ Repository Pattern
│ Eloquent ORM
┌─────────────────────▼───────────────────────────────────┐
│ DATABASE LAYER │
│ MySQL 8.x │
│ users · organizations · companies · events │
│ sponsorship_applications · bookmarks │
│ notifications · pitching_sessions │
└─────────────────────────────────────────────────────────┘
│
┌─────────────────────▼───────────────────────────────────┐
│ STORAGE & EXTERNAL │
│ Laravel Local Disk (PDF Proposal, Logo) │
│ API Wilayah Indonesia (Provinsi & Kota) │
└─────────────────────────────────────────────────────────┘


## 2.3 Autentikasi & Authorization

- **Auth:** JWT Authentication menggunakan Bearer Token
- **Token Type:** JSON Web Token yang dikirim melalui header:
  `Authorization: Bearer <token>`
- **Register:** Akun langsung aktif, tidak menggunakan email verification
- **Login:** User mendapatkan JWT token setelah email dan password valid
- **Logout:** Token user dihapus atau di-invalidate dari sistem
- **Auto-approve:** `is_verified` otomatis bernilai `true` saat biodata profil lengkap terisi
- **No forgot password:** Fitur lupa password tidak tersedia pada MVP
- **RBAC:** Role-Based Access Control dengan 3 role utama:
  - `admin`
  - `organisasi`
  - `perusahaan`
- **Authorization Middleware:** Setiap endpoint penting dilindungi oleh JWT middleware dan role middleware
- **Access Control:**
  - `admin` dapat mengelola seluruh data sistem
  - `organisasi` dapat membuat event, mengelola profil organisasi, dan mengajukan sponsorship
  - `perusahaan` dapat melihat peluang event, mengelola profil perusahaan, dan merespons sponsorship


## 2.4 File Upload

| Jenis File | Tipe yang Diterima | Maks Ukuran | Storage |
|---|---|---|---|
| Proposal Event | PDF only | 10 MB | `storage/app/public/proposals/` |
| Logo Organisasi | JPG, PNG, WEBP | 10 MB | `storage/app/public/logos/` |
| Logo Perusahaan | JPG, PNG, WEBP | 10 MB | `storage/app/public/logos/` |

## 2.5 Validasi Data

- **Field numerik:** min-max number validation
- **Field tanggal:** tidak ada validasi khusus — input bebas
- **Field list:** fixed dropdown dengan opsi `Lainnya` yang bisa diisi manual
- **Field teks:** `required` + max character limit sesuai konteks

## 2.6 Pagination

- **Metode:** Infinite Scroll (Lazy Loading)
- **Items per batch:** 6 item
- **Implementasi:** IntersectionObserver di React, `cursor`/`page` di Laravel
- **Diterapkan di:** daftar perusahaan, daftar event, daftar sponsorship, history

---

# 3. User Roles & Permissions

## 3.1 Role Overview

| Role | Deskripsi | Akses Utama |
|---|---|---|
| **Admin** | Pengelola platform, moderator, pengawas sistem. | Dashboard, manajemen user, moderasi event, monitoring sponsorship, laporan |
| **Organisasi** | Pembuat event dan pemohon sponsorship. | Buat event, upload proposal, cari perusahaan, apply sponsorship, bookmark, notifikasi |
| **Perusahaan** | Penerima dan penyeleksi proposal sponsorship. | Lihat request masuk, review proposal, accept/reject, history, notifikasi |

## 3.2 Access Control Matrix

| Resource / Aksi | Public | Organisasi | Perusahaan | Admin |
|---|:---:|:---:|:---:|:---:|
| Landing Page | ✅ | ✅ | ✅ | ✅ |
| Register / Login | ✅ | — | — | — |
| Dashboard sendiri | — | ✅ | ✅ | ✅ |
| Data Perusahaan (list & detail) | — | ✅ | ❌* | ✅ |
| Data Organisasi (list & detail) | — | ❌ | ❌ | ✅ |
| Buat / Edit / Hapus Event | — | ✅ | — | — |
| Upload Proposal PDF | — | ✅ | — | — |
| Apply Sponsorship | — | ✅ | — | — |
| Cancel Sponsorship (pending/reviewed) | — | ✅ | — | — |
| Lihat Request Sponsorship Masuk | — | — | ✅ (own) | ✅ |
| Review / Accept / Reject | — | — | ✅ | — |
| Ubah keputusan setelah final | — | — | ❌ | — |
| Bookmark Perusahaan | — | ✅ | — | — |
| Halaman Notifikasi | — | ✅ | ✅ | — |
| Pitching Session | — | ✅ (inisiasi) | ✅ | — |
| Moderasi Event (hide/remove) | — | — | — | ✅ |
| Manajemen & Ban User | — | — | — | ✅ |
| Laporan & Export | — | — | — | ✅ |

> **\*** Perusahaan hanya dapat melihat data organisasi dan event yang telah mengirim aplikasi sponsorship kepada mereka.

## 3.3 Account Status

```
is_active  = true   → Akun dapat login dan menggunakan platform
is_active  = false  → Akun di-ban oleh admin, tidak bisa login (401)
is_verified = true  → Biodata profil lengkap, mendapat badge terverifikasi
is_verified = false → Profil belum lengkap
```

> Tidak ada status `pending`, `suspended`, atau `rejected` pada akun. Admin hanya dapat **ban** (`is_active = false`) atau **hapus permanen** akun.

## 3.4 Sponsorship Status State Machine

```
[Organisasi Submit Apply]
         │
         ▼
      PENDING  ──── (Organisasi cancel) ──→  CANCELLED (final)
         │
         │ (Perusahaan buka detail — auto)
         ▼
      REVIEWED ──── (Organisasi cancel) ──→  CANCELLED (final)
         │
    ┌────┴────┐
    ▼         ▼
 ACCEPTED   REJECTED
 (final)    (final)
```

> **Keputusan perusahaan bersifat FINAL.** Tidak ada perubahan dari `accepted` ke `rejected` atau sebaliknya.

---

# 4. Feature Requirements (Per Role)

## 4.1 Admin

### 4.1.1 Dashboard Admin

Menampilkan kondisi umum platform secara keseluruhan.

**Statistik Utama:**
- Total organisasi terdaftar
- Total perusahaan terdaftar
- Total event aktif
- Total sponsorship: semua / accepted / rejected / pending
- Aktivitas terbaru (recent log)

**Filter Waktu:** Hari ini | 7 hari terakhir | 30 hari terakhir | Semua waktu

**Grafik Analytics:**
- Sponsorship per bulan (line/bar chart)
- Partnership berhasil (accepted sponsorships)
- Kategori event populer (pie/donut chart)
- Jumlah organisasi & perusahaan aktif per bulan

### 4.1.2 Manajemen Perusahaan

- List perusahaan: nama, industri, lokasi, status, jumlah sponsorship, tanggal bergabung
- Aksi: lihat detail, edit data, **hapus akun permanen**, **ban akun** (`is_active = false`)
- Auto-verified: tidak ada verifikasi manual — otomatis saat profil lengkap

### 4.1.3 Manajemen Organisasi

- List organisasi: nama, kategori, jumlah event, jumlah apply, tanggal bergabung
- Aksi: lihat detail, edit data, hapus akun permanen, ban akun

### 4.1.4 Manajemen Event & Proposal

| Aksi Admin | Deskripsi |
|---|---|
| **Approve** | Event tampil di platform (jika sebelumnya hidden/draft) |
| **Hide** | Event disembunyikan dari publik, data tetap ada |
| **Remove** | Event dihapus permanen dari platform |
| **View Proposal** | Admin dapat membuka dan membaca file proposal PDF |
| **View Sponsorship Count** | Lihat jumlah apply sponsorship dari event tersebut |

### 4.1.5 Monitoring Sponsorship

- Tampilkan semua pengajuan: organisasi, perusahaan, event, bentuk dukungan, status, tanggal
- Filter berdasarkan: status, tanggal, organisasi, perusahaan
- Admin **tidak dapat mengubah** status sponsorship — read-only monitoring

### 4.1.6 Laporan Sistem

- **Jenis laporan:** sponsorship, perusahaan, organisasi, event, partnership berhasil
- **Format export:** PDF, Excel, CSV

---

## 4.2 Organisasi

### 4.2.1 Home / Dashboard Organisasi

- Ringkasan statistik: accepted / pending / rejected sponsorship (count)
- Daftar tracking sponsorship terbaru: nama perusahaan, event, status, tanggal
- Quick action: Buat Event | Cari Sponsor | Lihat Bookmark
- Jika ada sponsorship **accepted**: tampilkan info kontak perusahaan untuk negosiasi lanjutan (email, phone, website, sosmed)

### 4.2.2 Manajemen Event

**Input Form Buat Event:**

| Field | Tipe | Validasi |
|---|---|---|
| Nama Kegiatan | text | required, max 200 char |
| Deskripsi Kegiatan | textarea | required |
| Target Peserta | text | required, max 200 char |
| Jumlah Peserta | number | required, min: 1, max: 1.000.000 |
| Provinsi | dropdown | required, dari API Wilayah Indonesia |
| Kota/Kabupaten | dropdown | required, cascade dari provinsi |
| Tanggal Kegiatan | date | required |
| Kategori Event | dropdown | required, fixed list + opsi Lainnya |
| Bentuk Dukungan Dibutuhkan | multi-select | required, fixed list + manual |
| Range Budget Sponsor | dropdown | required, fixed list |
| Proposal PDF | file | required, PDF only, max 10MB |

**Status Event:**

| Status | Keterangan | Aksi |
|---|---|---|
| `draft` | Baru dibuat, belum publish | Edit, Delete, Publish |
| `active` | Aktif dan dapat dilihat perusahaan | Edit, Archive, Apply Sponsor |
| `archived` | Diarsipkan oleh organisasi | View, Re-activate |
| `hidden` | Disembunyikan oleh admin | View only |
| `removed` | Dihapus oleh admin | Tidak tampil |

> **Catatan:** Event dengan aplikasi sponsorship aktif (pending/reviewed/accepted) tidak dapat dihapus langsung — harus diarsipkan terlebih dahulu.

### 4.2.3 Apply Sponsorship

**Form Apply:**

| Field | Keterangan |
|---|---|
| Event yang dipilih | dropdown dari event organisasi yang berstatus `active` |
| Perusahaan tujuan | auto-filled dari halaman perusahaan |
| Bentuk Dukungan Diminta | required, fixed list + opsi manual |
| Surat Pengantar (Cover Letter) | required, textarea, min 50 char, disimpan di `sponsorship_applications` |
| Pesan Tambahan | optional, textarea |

**Business Rules:**
- ✅ Satu event dapat diajukan ke **banyak perusahaan** yang berbeda.
- ❌ Satu event **TIDAK DAPAT** diajukan dua kali ke perusahaan yang sama.
- ✅ Organisasi dapat **cancel** pengajuan selama status masih `pending` atau `reviewed`.
- ❌ Setelah `accepted` atau `rejected`, organisasi tidak dapat cancel.
- ✅ Tidak ada batas maksimal jumlah apply per event.

### 4.2.4 Bookmark Perusahaan

- Simpan perusahaan ke daftar favorit
- Halaman dedicated **"Bookmark Sponsor"**
- Data yang tampil: nama, kategori, lokasi, bentuk sponsorship, status verifikasi
- Organisasi dapat hapus bookmark kapan saja

### 4.2.5 Notifikasi

- **Tipe:** In-app only (tidak ada email notification pada MVP)
- **Halaman:** Dedicated halaman Notifikasi
- **Trigger:** sponsorship reviewed, accepted, rejected, pitching request diterima
- **Fitur:** Mark as read (individual) + Mark all as read

### 4.2.6 Pitching Lanjutan

Fitur scheduling meeting setelah sponsorship `accepted`.

| Field | Keterangan |
|---|---|
| Tipe Meeting | `online` (Google Meet) atau `offline` (lokasi fisik) |
| Link Google Meet | Jika tipe online |
| Lokasi | Jika tipe offline |
| Tanggal & Waktu | datetime |
| Catatan | optional |

> Inisiasi oleh organisasi, notifikasi dikirim ke perusahaan.

---

## 4.3 Perusahaan

### 4.3.1 Home / Dashboard Perusahaan

- Daftar semua request sponsorship yang masuk ke perusahaan ini
- Data per card: nama organisasi, nama event, kategori, bentuk dukungan, tanggal kegiatan, status badge
- Filter: kategori event | bentuk dukungan | tanggal event | status | lokasi event
- Infinite scroll, 6 items per batch

### 4.3.2 Detail Request Sponsorship

Data yang ditampilkan:
- Profil organisasi pengirim (nama, deskripsi, kontak)
- Detail event: nama, deskripsi, target peserta, jumlah peserta, lokasi, tanggal
- Link download/preview **proposal PDF**
- **Surat pengantar** (cover letter) yang ditulis khusus untuk perusahaan ini
- Bentuk dukungan yang diminta
- Kontak organisasi: email, phone, Instagram, LinkedIn (tidak disembunyikan)

> **Auto-Reviewed:** Ketika perusahaan pertama kali membuka halaman detail request ini, sistem **otomatis** mengubah status dari `pending` → `reviewed` dan mencatat `reviewed_at`.

### 4.3.3 Aksi Sponsorship

| Aksi | Status Baru | Sifat |
|---|---|---|
| **ACCEPT** | `accepted` | **Final** — tidak dapat diubah |
| **REJECT** | `rejected` | **Final** — tidak dapat diubah |

- Perusahaan dapat menambahkan **pesan respons** saat accept atau reject (optional)
- Perusahaan **tidak dapat** mengubah keputusan setelah accepted/rejected

### 4.3.4 History Sponsorship

- Riwayat semua sponsorship: accepted, rejected, reviewed, pending
- Filter: status | kategori event | tanggal | nama organisasi

### 4.3.5 Profil Perusahaan

| Field | Validasi |
|---|---|
| Nama Perusahaan | required |
| Bidang Industri | required, fixed list + manual |
| Deskripsi | required |
| Provinsi & Kota | required, cascade dropdown |
| Alamat Lengkap | required |
| Email Bisnis | required, email format |
| Nomor Telepon | optional |
| Website | optional, url format |
| Instagram | optional |
| LinkedIn | optional |
| Logo Perusahaan | optional, JPG/PNG/WEBP, max 10MB |
| Preferensi Sponsorship | multi-select kategori event yang diminati |
| Bentuk Dukungan yang Bisa Diberikan | multi-select fixed list + custom |

---

# 5. Database Schema

## 5.1 Entity Relationship Diagram (Simplified)

```
users
  ├── organizations (1:1)
  │     ├── events (1:N)
  │     │     └── sponsorship_applications (1:N)
  │     ├── bookmarks (1:N) ──────────────── companies
  │     └── sponsorship_applications (1:N)
  └── companies (1:1)
        └── sponsorship_applications (1:N)

sponsorship_applications
  └── pitching_sessions (1:1)

users
  └── notifications (1:N)
```

## 5.2 Table: `users`

```sql
CREATE TABLE users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,           -- bcrypt hashed
  role          ENUM('admin','organisasi','perusahaan') NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,   -- false = banned
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,  -- true = profil lengkap
  created_at    TIMESTAMP,
  updated_at    TIMESTAMP
);
```

## 5.3 Table: `organizations`

```sql
CREATE TABLE organizations (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL UNIQUE, -- FK users (1:1)
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  category      VARCHAR(100),
  province      VARCHAR(100),
  city          VARCHAR(100),
  address       TEXT,
  logo_path     VARCHAR(255),
  email         VARCHAR(255),
  phone         VARCHAR(20),
  instagram     VARCHAR(100),
  linkedin      VARCHAR(255),
  website       VARCHAR(255),
  created_at    TIMESTAMP,
  updated_at    TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 5.4 Table: `companies`

```sql
CREATE TABLE companies (
  id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id                 BIGINT UNSIGNED NOT NULL UNIQUE, -- FK users (1:1)
  name                    VARCHAR(200) NOT NULL,
  industry                VARCHAR(100),
  description             TEXT,
  province                VARCHAR(100),
  city                    VARCHAR(100),
  address                 TEXT,
  email                   VARCHAR(255),
  phone                   VARCHAR(20),
  website                 VARCHAR(255),
  instagram               VARCHAR(100),
  linkedin                VARCHAR(255),
  logo_path               VARCHAR(255),
  sponsorship_preferences JSON,  -- array kategori event diminati
  support_types_offered   JSON,  -- array bentuk dukungan + custom
  created_at              TIMESTAMP,
  updated_at              TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 5.5 Table: `events`

```sql
CREATE TABLE events (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  organization_id     BIGINT UNSIGNED NOT NULL,
  name                VARCHAR(200) NOT NULL,
  description         TEXT NOT NULL,
  target_audience     VARCHAR(200) NOT NULL,
  participant_count   INT UNSIGNED NOT NULL,      -- min: 1
  province            VARCHAR(100) NOT NULL,
  city                VARCHAR(100) NOT NULL,
  event_date          DATE NOT NULL,
  category            VARCHAR(100) NOT NULL,
  support_types_needed JSON NOT NULL,             -- array bentuk dukungan
  budget_range        VARCHAR(50) NOT NULL,
  proposal_path       VARCHAR(255),               -- path file PDF
  status              ENUM('draft','active','archived','hidden','removed')
                      NOT NULL DEFAULT 'draft',
  created_at          TIMESTAMP,
  updated_at          TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

## 5.6 Table: `sponsorship_applications`

```sql
CREATE TABLE sponsorship_applications (
  id                   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id             BIGINT UNSIGNED NOT NULL,
  company_id           BIGINT UNSIGNED NOT NULL,
  organization_id      BIGINT UNSIGNED NOT NULL,
  support_type_requested VARCHAR(100) NOT NULL,
  cover_letter         TEXT NOT NULL,             -- surat pengantar khusus
  additional_message   TEXT,
  response_message     TEXT,                      -- pesan dari perusahaan
  status               ENUM('pending','reviewed','accepted','rejected','cancelled')
                       NOT NULL DEFAULT 'pending',
  reviewed_at          TIMESTAMP NULL,
  decided_at           TIMESTAMP NULL,
  created_at           TIMESTAMP,
  updated_at           TIMESTAMP,

  UNIQUE KEY uq_event_company (event_id, company_id), -- prevent duplicate apply
  INDEX idx_company_status (company_id, status),
  INDEX idx_org_status (organization_id, status),

  FOREIGN KEY (event_id)        REFERENCES events(id),
  FOREIGN KEY (company_id)      REFERENCES companies(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

## 5.7 Table: `bookmarks`

```sql
CREATE TABLE bookmarks (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  organization_id BIGINT UNSIGNED NOT NULL,
  company_id      BIGINT UNSIGNED NOT NULL,
  created_at      TIMESTAMP,

  UNIQUE KEY uq_org_company (organization_id, company_id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id)      REFERENCES companies(id)     ON DELETE CASCADE
);
```

## 5.8 Table: `notifications`

```sql
CREATE TABLE notifications (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  title        VARCHAR(200) NOT NULL,
  message      TEXT NOT NULL,
  type         VARCHAR(50) NOT NULL,
  -- type values: sponsorship_received | sponsorship_reviewed |
  --              sponsorship_accepted | sponsorship_rejected |
  --              sponsorship_cancelled | pitching_scheduled
  related_id   BIGINT UNSIGNED,        -- ID entitas terkait
  related_type VARCHAR(50),            -- 'sponsorship_application' | 'pitching_session'
  is_read      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMP,

  INDEX idx_user_read (user_id, is_read),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 5.9 Table: `pitching_sessions`

```sql
CREATE TABLE pitching_sessions (
  id                          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sponsorship_application_id  BIGINT UNSIGNED NOT NULL,  -- harus accepted
  type                        ENUM('online','offline') NOT NULL,
  meet_link                   VARCHAR(255),               -- jika online
  location                    TEXT,                       -- jika offline
  scheduled_at                DATETIME NOT NULL,
  notes                       TEXT,
  created_by                  BIGINT UNSIGNED NOT NULL,   -- user_id organisasi
  created_at                  TIMESTAMP,
  updated_at                  TIMESTAMP,

  FOREIGN KEY (sponsorship_application_id) REFERENCES sponsorship_applications(id),
  FOREIGN KEY (created_by)                 REFERENCES users(id)
);
```

---

# 6. API Endpoints Specification

## 6.1 Konvensi API

```
Base URL    : /api/v1
Content-Type: application/json
Auth Header : Authorization: Bearer {token}

Standard Response Format:
{
  "success": true | false,
  "message": "string",
  "data"   : object | array | null,
  "meta"   : { "current_page", "per_page", "total", "has_more" }  // untuk list
}
```

## 6.2 HTTP Status Codes

| Code | Status | Kapan Digunakan |
|---|---|---|
| `200` | OK | Request berhasil (GET, PUT, DELETE) |
| `201` | Created | Resource berhasil dibuat (POST) |
| `400` | Bad Request | Request tidak valid / logika bisnis gagal |
| `401` | Unauthorized | Token tidak ada, expired, atau akun banned |
| `403` | Forbidden | Token valid tapi tidak punya izin akses resource ini |
| `404` | Not Found | Resource tidak ditemukan |
| `422` | Unprocessable Entity | Validasi form gagal — sertakan `errors` object |
| `500` | Internal Server Error | Error tidak terduga di server |

---

## 6.3 Auth Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register akun baru (field: email, password, role) |
| `POST` | `/auth/login` | — | Login, return Bearer token |
| `POST` | `/auth/logout` | Bearer | Revoke current token |
| `GET` | `/auth/me` | Bearer | Get authenticated user + profile data |

**POST /auth/register — Request Body:**
```json
{
  "email"    : "user@example.com",
  "password" : "password123",
  "role"     : "organisasi" // atau "perusahaan"
}
```

**POST /auth/login — Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "1|abc123xyz...",
    "user" : { "id": 1, "email": "...", "role": "organisasi" }
  }
}
```

---

## 6.4 Organization Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/organizations` | Admin | List semua organisasi (admin only) |
| `GET` | `/organizations/{id}` | Admin \| Org(own) | Detail organisasi |
| `PUT` | `/organizations/{id}` | Org(own) | Update profil organisasi |
| `GET` | `/organizations/{id}/stats` | Org(own) | Statistik sponsorship milik organisasi |

---

## 6.5 Company Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/companies` | Org \| Admin | List perusahaan (infinite scroll, support query & filter) |
| `GET` | `/companies/{id}` | Org \| Admin | Detail perusahaan |
| `PUT` | `/companies/{id}` | Company(own) | Update profil perusahaan |
| `GET` | `/companies/{id}/stats` | Company(own) | Statistik sponsorship milik perusahaan |

**GET /companies — Query Params:**
```
?province=Jawa+Timur
&city=Surabaya
&industry=Teknologi
&support_type=Uang+Tunai
&search=PT+ABC
&cursor=eyJpZCI6...   // untuk infinite scroll
&limit=6
```

---

## 6.6 Event Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/events` | Org(own) \| Admin | List event milik organisasi / semua (admin) |
| `POST` | `/events` | Org | Buat event baru |
| `GET` | `/events/{id}` | Org(own) \| Admin | Detail event |
| `PUT` | `/events/{id}` | Org(own) | Update data event |
| `DELETE` | `/events/{id}` | Org(own) | Hapus event (hanya draft/archived tanpa aplikasi aktif) |
| `PUT` | `/events/{id}/status` | Org(own) | Ubah status event (publish → active, archive) |
| `POST` | `/events/{id}/proposal` | Org(own) | Upload / update proposal PDF (`multipart/form-data`) |

---

## 6.7 Sponsorship Application Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/sponsorships` | Org | Kirim apply sponsorship baru |
| `GET` | `/sponsorships` | Org \| Company \| Admin | List aplikasi (role-based filter otomatis) |
| `GET` | `/sponsorships/{id}` | Org(own) \| Company(own) \| Admin | Detail aplikasi — **auto trigger reviewed** |
| `PUT` | `/sponsorships/{id}/decide` | Company(own) | Accept atau Reject |
| `PUT` | `/sponsorships/{id}/cancel` | Org(own) | Cancel (hanya pending/reviewed) |

**POST /sponsorships — Request Body:**
```json
{
  "event_id"               : 12,
  "company_id"             : 5,
  "support_type_requested" : "Uang Tunai",
  "cover_letter"           : "Kami berharap PT ABC dapat menjadi sponsor...",
  "additional_message"     : "Optional pesan tambahan"
}
```

**PUT /sponsorships/{id}/decide — Request Body:**
```json
{
  "status"          : "accepted",   // atau "rejected"
  "response_message": "Kami tertarik untuk mendukung kegiatan ini."
}
```

---

## 6.8 Bookmark Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/bookmarks` | Org | List perusahaan yang di-bookmark |
| `POST` | `/bookmarks` | Org | Tambah bookmark (`{ company_id: 5 }`) |
| `DELETE` | `/bookmarks/{id}` | Org(own) | Hapus bookmark |

---

## 6.9 Notification Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/notifications` | Org \| Company | List notifikasi + unread count |
| `PUT` | `/notifications/{id}/read` | Own | Mark 1 notifikasi sebagai read |
| `PUT` | `/notifications/read-all` | Own | Mark semua notifikasi sebagai read |

---

## 6.10 Pitching Session Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/pitching` | Org | Jadwalkan pitching (sponsorship harus accepted) |
| `GET` | `/pitching/{id}` | Org \| Company (terkait) | Detail pitching session |
| `PUT` | `/pitching/{id}` | Org(creator) | Update detail pitching session |

---

## 6.11 Location Endpoints (Proxy API Wilayah Indonesia)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/location/provinces` | — | List semua provinsi Indonesia |
| `GET` | `/location/cities/{province_id}` | — | List kota/kabupaten berdasarkan provinsi |

---

## 6.12 Admin Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/admin/dashboard` | Admin | Statistik & analytics dashboard |
| `GET` | `/admin/users` | Admin | List semua user dengan filter |
| `PUT` | `/admin/users/{id}/ban` | Admin | Ban / unban akun (toggle `is_active`) |
| `DELETE` | `/admin/users/{id}` | Admin | Hapus akun permanen |
| `PUT` | `/admin/events/{id}/moderate` | Admin | Moderasi event (hide/remove/approve) |
| `GET` | `/admin/sponsorships` | Admin | Monitoring semua sponsorship |
| `GET` | `/admin/reports/export` | Admin | Export laporan (query: `type`, `format`, `range`) |

---

# 7. UI/UX Requirements

## 7.1 Navigation Structure

| Role | Navbar Menu |
|---|---|
| **Public** | Landing Page |
| **Admin** | Dashboard · Perusahaan · Organisasi · Event · Sponsorship · Laporan · Akun · Logout |
| **Organisasi** | Home · Event · Apply Sponsor · Bookmark · Notifikasi 🔔 · Akun · Logout |
| **Perusahaan** | Home · History · Notifikasi 🔔 · Akun · Logout |

## 7.2 Design System

| Aspek | Detail |
|---|---|
| **Framework Styling** | Tailwind CSS (utility-first) |
| **Font** | Inter (Google Fonts) atau sistem font default |
| **Warna Primer** | `#1E3A5F` (deep navy) |
| **Warna Accent** | `#2E86AB` (teal-blue) |
| **Warna Background** | `#F5F7FA` (light gray) |
| **Border Radius** | `rounded-lg` (8px) untuk card, `rounded-full` untuk badge |
| **Shadow** | `shadow-md` untuk card, `shadow-lg` untuk modal |
| **Breakpoints** | `sm: 640px` · `md: 768px` · `lg: 1024px` · `xl: 1280px` |
| **Icons** | Heroicons atau Lucide React |
| **Component Library** | Shadcn/ui atau Headless UI (opsional, percepat development) |

## 7.3 Status Badge Color System

```
pending   → bg-gray-100   text-gray-600   ●
reviewed  → bg-blue-100   text-blue-600   ●
accepted  → bg-green-100  text-green-600  ●
rejected  → bg-red-100    text-red-600    ●
cancelled → bg-orange-100 text-orange-600 ●
```

## 7.4 Komponen UI Kritis

### Sponsorship Card
```
┌─────────────────────────────────────────────┐
│  [Logo Org]  Nama Organisasi          [Status Badge]  │
│              Nama Event                               │
│              📍 Kota · 📅 Tanggal · 🎯 Kategori      │
│              Bentuk Dukungan: Uang Tunai              │
│  [Lihat Detail]                                       │
└───────────────────────────────────────────────────────┘
```

### Company Card (untuk Organisasi)
```
┌─────────────────────────────────────────────┐
│  [Logo]  PT Nama Perusahaan  ✅ Terverifikasi │
│          Industri · Kota, Provinsi            │
│          Dukungan: Uang Tunai +2 lagi         │
│  [🔖 Bookmark]          [Apply Sponsor →]     │
└───────────────────────────────────────────────┘
```

### Notification Bell
```
Navbar: 🔔 [badge: 3]  ← unread count
Dropdown: list 5 notif terbaru + tombol "Lihat Semua"
```

## 7.5 Form Behavior

- **Client-side validation:** React Hook Form + Zod atau native HTML5
- **Server-side validation:** Laravel FormRequest
- **Error display:** Inline di bawah field dengan warna merah (`text-red-500 text-sm`)
- **Success feedback:** Toast notification (kanan atas, 3 detik)
- **Loading state:** Disable button + spinner icon saat API call berlangsung
- **Cascade dropdown lokasi:** Provinsi load saat mount, kota load saat provinsi dipilih

## 7.6 Infinite Scroll Behavior

```
1. Render 6 item pertama saat halaman load
2. Pasang IntersectionObserver pada sentinel element di bawah list
3. Saat sentinel terdeteksi, fetch halaman berikutnya (cursor-based)
4. Tampilkan skeleton loader saat fetching
5. Hentikan fetch jika `has_more = false`
```

## 7.7 Halaman Wajib

| Halaman | Akses | Keterangan |
|---|---|---|
| `/` | Public | Landing page — hero, cara kerja, CTA register |
| `/login` | Public | Form login |
| `/register` | Public | Form register + pilih role |
| `/dashboard` | Org/Company | Dashboard sesuai role |
| `/events` | Org | List & manajemen event |
| `/events/create` | Org | Form buat event baru |
| `/companies` | Org | Daftar perusahaan + filter + infinite scroll |
| `/companies/{id}` | Org | Detail perusahaan + tombol apply & bookmark |
| `/sponsorships` | Org/Company | List sponsorship (tergantung role) |
| `/sponsorships/{id}` | Org/Company | Detail sponsorship |
| `/bookmarks` | Org | Daftar perusahaan yang di-bookmark |
| `/notifications` | Org/Company | Halaman notifikasi lengkap |
| `/account` | All | Edit profil akun |
| `/admin/*` | Admin | Panel admin (dashboard, user, event, sponsorship, laporan) |
| `/403` | All | Halaman akses ditolak |
| `/404` | All | Halaman tidak ditemukan |

---

# 8. Development Phases & Milestones

## 8.1 Timeline Overview

```
Total : 7 Hari (1 Minggu)
Tim   : FE (Frontend) · BE (Backend) · DOC (Laporan & Testing)
```

## 8.2 Daily Milestones

| Hari | Fase | PIC | Target & Deliverables |
|---|---|---|---|
| **1** | **Project Setup** | BE + FE | Init Laravel + React project · Konfigurasi DB MySQL · Install dependencies (Sanctum, L5-Swagger, Tailwind) · Struktur folder · Git repository + branching strategy |
| **1–2** | **Auth & Core BE** | BE | Migration semua 8 tabel · Auth API (register, login, logout, me) · RBAC Middleware · Seeder admin · Response format standard |
| **1–2** | **Core UI & Routing** | FE | Landing page · Halaman auth (login/register pilih role) · React Router setup · Axios instance + request/response interceptor (token attach, 401 handler) |
| **2–3** | **Org Features BE+FE** | BE + FE | CRUD Event API + UI · Upload proposal PDF · Profil organisasi · Cascade dropdown lokasi (API Wilayah) |
| **3–4** | **Apply Flow** | BE + FE | Apply sponsorship API + form UI · Status tracking · Dashboard organisasi (stats + tracking list) · Notifikasi trigger |
| **3–4** | **Company Features** | BE + FE | Dashboard perusahaan (request list + filter) · Detail request + auto-reviewed logic · Accept/Reject API + UI · History perusahaan |
| **4–5** | **Admin Panel** | BE + FE | Dashboard admin (stats + chart) · Manajemen user (list, ban, delete) · Moderasi event · Monitoring sponsorship · Export laporan |
| **5** | **Extras** | BE + FE | Bookmark API + UI · Notifikasi halaman + mark read · Pitching session API + form |
| **6** | **API Docs & Testing** | BE + DOC | Swagger annotation semua endpoint · Postman collection · Functional testing 25 test case · Bug fixing |
| **7** | **Polish & Demo Prep** | ALL | UI polish & responsiveness · Laporan teknis · Demo preparation · README documentation |

## 8.3 Git Branching Strategy

```
main          ← production-ready, hanya merge dari dev
dev           ← integration branch
feature/auth  ← fitur auth
feature/event ← fitur event
feature/apply ← fitur apply sponsorship
feature/admin ← fitur admin panel
```

## 8.4 Environment & Setup Commands

```bash
# Backend (Laravel)
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve

# Frontend (React + Vite)
npm install
cp .env.example .env.local
npm run dev

# Swagger docs
php artisan l5-swagger:generate
# Akses: /api/documentation
```

---

# 9. Testing & Acceptance Criteria

## 9.1 Functional Testing Checklist (25 Test Cases)

| # | Test Case | Expected Result | Role |
|---|---|---|---|
| 1 | Register akun organisasi baru | Akun dibuat, dapat login langsung | Org |
| 2 | Register akun perusahaan baru | Akun dibuat, dapat login langsung | Company |
| 3 | Login dengan kredensial valid | Return bearer token, redirect ke dashboard | All |
| 4 | Login dengan password salah | 401 Unauthorized + pesan error | All |
| 5 | Lengkapi semua field profil organisasi | `is_verified` otomatis `true`, badge muncul | Org |
| 6 | Buat event baru + upload proposal PDF | Event tersimpan, proposal terupload, status `draft` | Org |
| 7 | Publish event (draft → active) | Status berubah ke `active` | Org |
| 8 | Cari perusahaan dengan filter provinsi | List sesuai filter, infinite scroll berfungsi | Org |
| 9 | Bookmark perusahaan | Perusahaan masuk halaman bookmark | Org |
| 10 | Apply sponsorship ke perusahaan | Aplikasi dibuat, status `pending`, notifikasi terkirim | Org |
| 11 | Apply ke perusahaan yang sama untuk event yang **sama** | `422` — duplicate application error | Org |
| 12 | Apply ke perusahaan yang sama untuk event yang **berbeda** | ✅ Berhasil — event berbeda, boleh | Org |
| 13 | Cancel sponsorship (status pending) | Status → `cancelled` | Org |
| 14 | Perusahaan buka detail request | Status otomatis `pending` → `reviewed` | Company |
| 15 | Perusahaan klik Accept | Status → `accepted`, notifikasi dikirim ke organisasi | Company |
| 16 | Perusahaan klik Reject | Status → `rejected`, notifikasi dikirim ke organisasi | Company |
| 17 | Perusahaan ubah keputusan setelah accepted | `403` Forbidden — keputusan final | Company |
| 18 | Organisasi lihat notifikasi accepted | Notifikasi muncul, kontak perusahaan tampil di dashboard | Org |
| 19 | Jadwalkan pitching (sponsorship accepted) | Pitching terbuat, notifikasi ke perusahaan | Org |
| 20 | Admin lihat dashboard statistik | Semua angka dan chart tampil benar | Admin |
| 21 | Admin hide event | Event tidak tampil untuk user non-admin | Admin |
| 22 | Admin ban akun | User tidak bisa login — `401` banned | Admin |
| 23 | Admin export laporan CSV | File CSV terdownload dengan data benar | Admin |
| 24 | Upload file > 10MB | `422` — file too large error | Org |
| 25 | Upload file bukan PDF untuk proposal | `422` — invalid file type error | Org |

## 9.2 API Testing — Postman Collection Structure

```
📁 Eventora API Collection
├── 📁 Auth
│   ├── POST Register Organisasi
│   ├── POST Register Perusahaan
│   ├── POST Login (valid)
│   ├── POST Login (invalid)
│   └── GET Me
├── 📁 Events
│   ├── POST Create Event
│   ├── GET List Events
│   ├── PUT Update Event
│   ├── PUT Publish Event
│   └── POST Upload Proposal
├── 📁 Companies
│   ├── GET List Companies
│   ├── GET Company Detail
│   └── PUT Update Company Profile
├── 📁 Sponsorship Applications
│   ├── POST Apply Sponsorship
│   ├── GET List (Org view)
│   ├── GET List (Company view)
│   ├── GET Detail (auto-reviewed test)
│   ├── PUT Decide (Accept)
│   ├── PUT Decide (Reject)
│   └── PUT Cancel
├── 📁 Bookmarks
│   ├── POST Add Bookmark
│   ├── GET List Bookmarks
│   └── DELETE Remove Bookmark
├── 📁 Notifications
│   ├── GET List Notifications
│   ├── PUT Read One
│   └── PUT Read All
├── 📁 Pitching
│   └── POST Schedule Pitching
└── 📁 Admin
    ├── GET Dashboard Stats
    ├── PUT Ban User
    ├── PUT Moderate Event
    └── GET Export Report
```

**Yang diverifikasi per test:**
- HTTP Status Code sesuai spesifikasi
- Response body format `{ success, message, data }`
- Data tersimpan benar di database
- Error message deskriptif
- Role-based access: `403` untuk akses yang tidak diizinkan

## 9.3 Non-Functional Requirements

| Aspek | Requirement |
|---|---|
| **Performance** | API response time < 2 detik (environment lokal) |
| **Security** | Semua endpoint (kecuali public) wajib Bearer token valid |
| **Security** | Eloquent ORM untuk cegah SQL injection, escape output untuk XSS |
| **Availability** | Stabil di localhost untuk demo |
| **Usability** | Semua core flow dapat diselesaikan tanpa panduan tambahan |
| **Documentation** | Semua endpoint terdokumentasi di Swagger UI |
| **Code Quality** | Struktur MVC Laravel, komponen React modular, tidak ada hardcoded credentials |

---

# 10. AI Development Prompts (Bonus!)

> Prompt-prompt ini siap digunakan untuk mempercepat vibe coding dengan AI assistant (Cursor, GitHub Copilot, v0.dev, dll).

---

## 10.1 Laravel Backend Prompts

### 🔧 Prompt: Auth API dengan Sanctum

```
Buatkan Laravel 11 Sanctum authentication API lengkap dengan endpoint:
- POST /api/v1/auth/register (field: email, password, role enum[organisasi,perusahaan])
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- GET /api/v1/auth/me

Requirements:
- Gunakan FormRequest untuk validasi setiap endpoint
- Response format standar: { success: bool, message: string, data: object }
- Saat register, otomatis buat record di tabel organizations atau companies sesuai role
- Tambahkan middleware CheckAccountActive yang cek is_active = true sebelum proses request
- Jika is_active = false, return 401 dengan pesan "Akun Anda telah dinonaktifkan"
- Buat AuthController dengan method register, login, logout, me
```

### 🔧 Prompt: Apply Sponsorship API

```
Buatkan Laravel API endpoint POST /api/v1/sponsorships untuk fitur apply sponsorship.

Validasi (FormRequest):
- event_id: required, exists di tabel events, status harus 'active', harus milik auth user
- company_id: required, exists di tabel companies
- support_type_requested: required, string max 100
- cover_letter: required, string min 50 char
- additional_message: nullable, string

Business Rules di Controller:
1. Cek unique constraint event_id + company_id, jika duplicate return 422 dengan pesan yang jelas
2. Buat record sponsorship_application dengan status 'pending'
3. Buat notifikasi ke user perusahaan tujuan dengan type 'sponsorship_received'
4. Return 201 dengan data sponsorship yang baru dibuat
```

### 🔧 Prompt: Auto-Reviewed Middleware

```
Buatkan logic di SponsorshipApplicationController@show agar:
1. Ketika user berole 'perusahaan' membuka GET /api/v1/sponsorships/{id}
2. Cek apakah sponsorship_application.company_id = company milik auth user
3. Jika status masih 'pending', otomatis update:
   - status = 'reviewed'
   - reviewed_at = now()
4. Buat notifikasi ke organisasi terkait dengan type 'sponsorship_reviewed'
5. Return data sponsorship yang sudah terupdate

Gunakan Eloquent dengan proper relationship. Return 403 jika bukan company yang tepat.
```

### 🔧 Prompt: Admin Dashboard Stats API

```
Buatkan AdminController@dashboard untuk GET /api/v1/admin/dashboard.

Data yang harus dikumpulkan (gunakan Eloquent aggregate):
- total_organizations: count users with role organisasi
- total_companies: count users with role perusahaan
- total_active_events: count events with status 'active'
- sponsorship_stats: { total, accepted, rejected, pending, reviewed }
- monthly_sponsorships: group by MONTH(created_at) untuk 12 bulan terakhir
- popular_categories: group by category dari tabel events, top 5
- recent_activities: 10 aktivitas terbaru dari sponsorship_applications

Tambahkan query parameter 'range' dengan value: today, week, month, all
Filter data berdasarkan range tersebut kecuali monthly_sponsorships dan popular_categories.
```

### 🔧 Prompt: Migration Script Lengkap

```
Buatkan Laravel migration untuk semua tabel sistem Eventora dalam urutan yang benar
(perhatikan foreign key dependencies):

1. users: id, email(unique), password, role(enum: admin,organisasi,perusahaan), 
   is_active(bool,default:true), is_verified(bool,default:false), timestamps

2. organizations: id, user_id(FK,unique), name, description, category, province, city, 
   address, logo_path, email, phone, instagram, linkedin, website, timestamps

3. companies: id, user_id(FK,unique), name, industry, description, province, city, 
   address, email, phone, website, instagram, linkedin, logo_path, 
   sponsorship_preferences(JSON), support_types_offered(JSON), timestamps

4. events: id, organization_id(FK), name, description, target_audience, 
   participant_count(unsignedInt), province, city, event_date(date), category, 
   support_types_needed(JSON), budget_range, proposal_path, 
   status(enum:draft,active,archived,hidden,removed,default:draft), timestamps

5. sponsorship_applications: id, event_id(FK), company_id(FK), organization_id(FK),
   support_type_requested, cover_letter(text), additional_message(text,nullable), 
   response_message(text,nullable), status(enum:pending,reviewed,accepted,rejected,cancelled),
   reviewed_at(timestamp,nullable), decided_at(timestamp,nullable), timestamps
   + UNIQUE(event_id, company_id)
   + INDEX(company_id, status)

6. bookmarks: id, organization_id(FK), company_id(FK), created_at
   + UNIQUE(organization_id, company_id)

7. notifications: id, user_id(FK), title, message(text), type(varchar50), 
   related_id(bigint,nullable), related_type(varchar50,nullable), 
   is_read(bool,default:false), created_at
   + INDEX(user_id, is_read)

8. pitching_sessions: id, sponsorship_application_id(FK), type(enum:online,offline),
   meet_link(nullable), location(text,nullable), scheduled_at(datetime), 
   notes(text,nullable), created_by(FK users), timestamps

Semua FK dengan ON DELETE CASCADE yang relevan.
```

---

## 10.2 React Frontend Prompts

### ⚛️ Prompt: Company Card Component

```
Buatkan React component CompanyCard menggunakan Tailwind CSS.

Props interface:
{
  company: {
    id: number
    name: string
    industry: string
    city: string
    province: string
    logo_url: string | null
    is_verified: boolean
    support_types_offered: string[]
  }
  isBookmarked: boolean
  onBookmarkToggle: (id: number) => void
  onApply: (id: number) => void
}

Requirements:
- Logo dengan fallback ke initial nama jika logo_url null (bg-blue-500 text-white rounded-full)
- Badge "Terverifikasi" dengan icon ✓ jika is_verified = true
- Tampilkan max 3 support_types, sisanya "+N lagi"
- Tombol bookmark toggle (filled/outline) tanpa reload halaman
- Tombol "Apply Sponsor" navigasi ke form apply
- Hover effect: shadow meningkat, subtle scale transform
- Mobile responsive: full width di mobile, 2 kolom di tablet, 3 di desktop
```

### ⚛️ Prompt: Custom Infinite Scroll Hook

```
Buatkan custom React hook useInfiniteScroll yang bisa digunakan untuk semua list page.

Interface:
useInfiniteScroll<T>({
  fetchFn: (cursor?: string) => Promise<{ data: T[], next_cursor: string | null }>
  enabled?: boolean
})

Returns:
{
  data: T[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  error: string | null
  sentinelRef: RefObject<HTMLDivElement>  // attach ke div sentinel di bawah list
  reset: () => void
}

Requirements:
- Gunakan IntersectionObserver untuk detect sentinel
- Fetch pertama saat hook mount (jika enabled = true)
- Fetch berikutnya saat sentinel terlihat dan hasMore = true dan tidak sedang loading
- Handle error state
- Bisa di-reset (misal saat filter berubah)

Contoh penggunaan:
const { data: companies, loadingMore, hasMore, sentinelRef } = useInfiniteScroll({
  fetchFn: (cursor) => api.get('/companies', { params: { cursor, limit: 6 } })
})
```

### ⚛️ Prompt: Sponsorship Status Badge

```
Buatkan React component StatusBadge({ status, size? }) untuk sponsorship status.

Status values: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'cancelled'

Color mapping (Tailwind):
- pending   → bg-gray-100 text-gray-600 (dot: bg-gray-400)
- reviewed  → bg-blue-100 text-blue-700 (dot: bg-blue-500)
- accepted  → bg-green-100 text-green-700 (dot: bg-green-500)
- rejected  → bg-red-100 text-red-700 (dot: bg-red-500)
- cancelled → bg-orange-100 text-orange-700 (dot: bg-orange-500)

Label text (bahasa Indonesia):
- pending → Menunggu
- reviewed → Ditinjau
- accepted → Diterima
- rejected → Ditolak
- cancelled → Dibatalkan

Props:
- status: string (required)
- size: 'sm' | 'md' (default: 'md')

Style: rounded-full pill, dengan dot indicator kiri, font-medium
Size sm: text-xs px-2 py-0.5 | Size md: text-sm px-3 py-1
```

### ⚛️ Prompt: Apply Sponsorship Form

```
Buatkan React page/component ApplySponsorshipForm dengan React Hook Form + Zod.

Form fields:
1. event_id: select dropdown dari GET /api/v1/events (filter status=active), 
   tampilkan nama event sebagai option
2. support_type_requested: select dari fixed list + opsi "Lainnya" yang reveal text input
3. cover_letter: textarea, min 50 karakter, tampilkan live character count
4. additional_message: textarea, optional

Props: companyId (dari URL params atau props)

Behavior:
- Saat submit, POST /api/v1/sponsorships
- Loading state: disable semua field + button saat submitting
- Success: tampilkan toast "Pengajuan sponsorship berhasil dikirim!" + redirect ke /sponsorships
- Error 422: tampilkan error per field di bawah input
- Error 400 duplicate: tampilkan alert "Anda sudah pernah mengajukan sponsorship ke perusahaan ini untuk event yang sama"

Fixed list support_types: ["Uang Tunai", "Barang", "Jasa", "Media Partner", 
"Venue / Tempat", "Konsumsi", "Merchandise", "Transportasi", 
"Pembicara / Narasumber", "Peralatan", "Lainnya"]
```

### ⚛️ Prompt: Admin Dashboard dengan Chart

```
Buatkan React AdminDashboard page yang fetch dari GET /api/v1/admin/dashboard.

Layout:
1. Filter bar atas: 4 tombol (Hari ini | 7 Hari | 30 Hari | Semua)
2. Stats cards row (4 card): Total Organisasi, Total Perusahaan, Total Event Aktif, Total Sponsorship
3. Sponsorship breakdown row (3 card dengan warna): Accepted(green), Rejected(red), Pending(yellow)
4. Chart row 2 kolom:
   - Kiri: Line chart "Sponsorship per Bulan" (12 bulan terakhir) — gunakan Recharts LineChart
   - Kanan: Pie chart "Kategori Event Populer" — gunakan Recharts PieChart
5. Tabel "Aktivitas Terbaru" di bawah: 10 row, kolom: Organisasi | Perusahaan | Event | Status | Waktu

Gunakan Recharts untuk semua chart.
Loading state: skeleton loader per section.
Re-fetch otomatis saat filter berubah.
Warna tema: primary #1E3A5F, accent #2E86AB.
```

---

## 10.3 Database Seeder Prompt

```
Buatkan Laravel DatabaseSeeder yang membuat data dummy realistis untuk testing:

1. AdminSeeder:
   - 1 akun admin: admin@eventora.com / password123

2. CompanySeeder (10 perusahaan):
   - Nama perusahaan Indonesia yang realistis (PT, CV, dll)
   - Industri bervariasi dari fixed list
   - Lokasi bervariasi antar provinsi
   - is_verified = true semua
   - support_types_offered random 2-4 item

3. OrganizationSeeder (10 organisasi):
   - Nama organisasi mahasiswa/komunitas
   - Kategori bervariasi
   - is_verified = true semua

4. EventSeeder (20 event dari berbagai organisasi):
   - Status campuran: 15 active, 3 archived, 2 draft
   - Kategori event bervariasi
   - proposal_path bisa null

5. SponsorshipSeeder (30 aplikasi):
   - Kombinasi event dan perusahaan yang valid (tidak duplicate per pasang)
   - Status bervariasi: 10 pending, 8 reviewed, 7 accepted, 5 rejected

Gunakan Faker dengan locale id_ID untuk nama Indonesia.
Panggil semua seeder dari DatabaseSeeder dengan urutan yang benar.
```

---

# Appendix: Reference Data

## A. Kategori Event (Fixed List)

```
Pendidikan        Kewirausahaan
Olahraga          Kompetisi
Teknologi         Seminar
Seni & Budaya     Workshop
Sosial            Lainnya (manual input)
Lingkungan
```

## B. Bentuk Dukungan (Fixed List + Custom)

```
Uang Tunai            Pembicara / Narasumber
Barang                Peralatan
Jasa                  Transportasi
Media Partner         Konsumsi
Venue / Tempat        Merchandise
Lainnya (custom input)
```

## C. Range Budget Sponsor

```
Kurang dari Rp 1.000.000
Rp 1.000.000 – Rp 5.000.000
Rp 5.000.000 – Rp 10.000.000
Rp 10.000.000 – Rp 25.000.000
Lebih dari Rp 25.000.000
```

## D. Trigger Notifikasi

| Event | Penerima | Pesan |
|---|---|---|
| Sponsorship baru masuk | Perusahaan | Organisasi [X] telah mengajukan sponsorship untuk event [Y] |
| Sponsorship reviewed | Organisasi | Pengajuan Anda ke [Perusahaan X] sedang ditinjau |
| Sponsorship accepted | Organisasi | Selamat! [Perusahaan X] menerima pengajuan sponsorship Anda |
| Sponsorship rejected | Organisasi | [Perusahaan X] menolak pengajuan sponsorship Anda |
| Sponsorship cancelled | Perusahaan | Organisasi [X] membatalkan pengajuan sponsorship |
| Pitching dijadwalkan | Perusahaan | [Organisasi X] mengundang Anda untuk pitching session |

## E. Out of Scope (MVP)

| Fitur | Alasan Tidak Dimasukkan |
|---|---|
| Email notification | Butuh SMTP config, tambah kompleksitas |
| Real-time chat (WebSocket) | Scope terlalu besar untuk 1 minggu |
| Sistem rekomendasi AI | Butuh model ML terpisah |
| Forgot password | Butuh email service |
| Rating & review | Fitur lanjutan post-MVP |
| Cloud deployment | Cukup localhost untuk demo UAS |

---

*Dokumen ini dibuat sebagai panduan development untuk proyek akhir mata kuliah Pemrograman Web & API.*  
*PRD ini dapat digunakan sebagai input langsung untuk AI vibe coding (Cursor, GitHub Copilot, v0.dev, dsb.)*