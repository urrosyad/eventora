# Project Reverse Engineering – Eventora

---

## 1. Ringkasan Sistem
Eventora adalah platform **web full‑stack** yang memungkinkan organisasi, perusahaan, dan admin mengelola event, mengajukan sponsorship, serta berinteraksi melalui bookmark dan notifikasi. Sistem terdiri dari:
- **Backend**: Laravel 12 (PHP 8.2) dengan JWT‑based authentication.
- **Frontend**: React 19 + Vite, TypeScript, TailwindCSS, React‑Query, Radix UI, dan Zustand untuk state management.
- **Database**: MySQL (atau SQLite pada dev) dengan skema relasional yang mencakup user, organisasi, perusahaan, event, sponsorship, dll.

---

## 2. Tech Stack
| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 12, PHP 8.2, MySQL (default), `php‑open‑source‑saver/jwt‑auth` |
| Frontend | React 19, Vite 8, TypeScript 6, TailwindCSS 3, Radix UI, React‑Query, Zustand |
| Dev Tools | Composer, npm, Laravel Sail, PHPUnit, ESLint, Prettier |

---

## 3. Daftar Library
### Composer (`backend/composer.json`)
```json
{
  "require": {
    "php": "^8.2",
    "darkaonline/l5-swagger": "^11.0",
    "doctrine/annotations": "^2.0",
    "laravel/framework": "^12.0",
    "laravel/tinker": "^2.10.1",
    "php-open-source-saver/jwt-auth": "^2.8"
  },
  "require-dev": {
    "fakerphp/faker": "^1.23",
    "laravel/pail": "^1.2.2",
    "laravel/pint": "^1.24",
    "laravel/sail": "^1.41",
    "mockery/mockery": "^1.6",
    "nunomaduro/collision": "^8.6",
    "phpunit/phpunit": "^11.5.50"
  }
}
```

### npm (`frontend/package.json`)
```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.4.0",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@tanstack/react-query": "^5.100.14",
    "axios": "^1.16.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "embla-carousel-auto-scroll": "^8.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.40.0",
    "lucide-react": "^1.17.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-hook-form": "^7.76.1",
    "react-is": "^19.2.6",
    "react-router-dom": "^7.16.0",
    "recharts": "^3.8.1",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "zod": "^4.4.3",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/node": "^24.12.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.0",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "postcss": "^8.5.15",
    "tailwindcss": "^3.4.1",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.59.2",
    "vite": "^8.0.12"
  }
}
```
---

## 4. Struktur Folder Penting
```
Eventora/
├─ backend/
│   ├─ app/Http/Controllers/   # semua controller API
│   ├─ database/migrations/    # skema DB
│   ├─ routes/api.php          # definisi route
│   └─ composer.json
├─ frontend/
│   ├─ src/components/        # UI reusable
│   ├─ src/routes/            # halaman route React
│   ├─ src/pages/ (opsional)  # view layer
│   └─ package.json
└─ docs/
    └─ PROJECT_REVERSE_ENGINEERING.md   # laporan ini
```
---

## 5. Database Schema Aktual (dari migrations)
### users
| Kolom | Tipe | Default | Keterangan |
|------|------|---------|------------|
| id | bigint (auto) | – | Primary Key |
| email | string | – | Unique |
| password | string | – | – |
| role | enum('admin','organisasi','perusahaan') | – | – |
| is_active | boolean | true | indexed |
| is_verified | boolean | false | indexed |
| created_at / updated_at | timestamps | – | – |
| index(role) | – | – | – |
[File reference](file:///d:/MANAJEMEN%20INFORMATIKA%202024/UAS%20WEB%20N%20API/Eventora/backend/database/migrations/0001_01_01_000001_create_users_table.php)

### organizations
| Kolom | Tipe | Default | Keterangan |
|------|------|---------|------------|
| id | bigint (auto) | – | PK |
| name | string | – | – |
| user_id | foreignId (users) | nullable | owner |
| created_at / updated_at | timestamps | – | – |
[File reference](file:///d:/MANAJEMEN%20INFORMATIKA%202024/UAS%20WEB%20N%20API/Eventora/backend/database/migrations/0001_01_01_000002_create_organizations_table.php)

### companies (perusahaan)
| Kolom | Tipe | Default | Keterangan |
|------|------|---------|------------|
| id | bigint (auto) | – | PK |
| name | string | – | – |
| user_id | foreignId (users) | nullable | owner |
| created_at / updated_at | timestamps | – | – |
[File reference](file:///d:/MANAJEMEN%20INFORMATIKA%202024/UAS%20WEB%20N%20API/Eventora/backend/database/migrations/0001_01_01_000003_create_companies_table.php)

### events
| Kolom | Tipe | Default | Keterangan |
|------|------|---------|------------|
| id | bigint (auto) | – | PK |
| organization_id | foreignId (organizations) | – |
| title | string | – |
| description | text | – |
| status | enum('draft','published','cancelled') | 'draft' |
| proposal_path | string | nullable |
| start_date / end_date | datetime | – |
| created_at / updated_at | timestamps | – |
[File reference](file:///d:/MANAJEMEN%20INFORMATIKA%202024/UAS%20WEB%20N%20API/Eventora/backend/database/migrations/0001_01_01_000004_create_events_table.php)

### sponsorship_applications
| Kolom | Tipe | Default | Keterangan |
|------|------|---------|------------|
| id | bigint (auto) | – | PK |
| event_id | foreignId (events) | – |
| company_id | foreignId (companies) | – |
| status | enum('pending','accepted','rejected') | 'pending' |
| created_at / updated_at | timestamps | – |
[File reference](file:///d:/MANAJEMEN%20INFORMATIKA%202024/UAS%20WEB%20N%20API/Eventora/backend/database/migrations/0001_01_01_000005_create_sponsorship_applications_table.php)

*(Other tables – bookmarks, notifications, pitching_sessions, cache & jobs – follow a similar pattern; omitted for brevity.)*
---

## 6. Relasi antar Tabel
- **users ↔ organizations** – `organizations.user_id` (nullable) mengindikasikan pemilik organisasi.
- **users ↔ companies** – `companies.user_id` (nullable) mengindikasikan pemilik perusahaan.
- **organizations ↔ events** – `events.organization_id` (FK) satu‑to‑many.
- **events ↔ sponsorship_applications** – satu event dapat memiliki banyak sponsorship.
- **companies ↔ sponsorship_applications** – satu perusahaan dapat mengajukan ke banyak event.
- **users ↔ sessions** – Laravel session driver (optional).
- **bookmarks** menghubungkan `user_id` dengan `event_id`.
- **notifications** berisi `user_id` dan referensi ke entitas terkait.
- **pitching_sessions** berhubungan dengan `organization_id` dan `event_id`.
---

## 7. Seeder & Akun Dummy
- `Database/Seeders/DatabaseSeeder.php` memanggil:
  - `UserSeeder` – membuat admin (`admin@eventora.test`), contoh organisasi & perusahaan.
  - `OrganizationSeeder`, `CompanySeeder`, `EventSeeder`, `SponsorshipSeeder` – mengisi data contoh.
- File‑path contoh: `backend/database/seeders/UserSeeder.php`.
---

## 8. Auth JWT, Middleware, Role, Ownership Rules
- **JWT** di‑implementasikan lewat package `php-open-source-saver/jwt-auth`. Token dibuat pada `AuthController@login` dan disertakan di header `Authorization: Bearer <token>`.
- **Middleware**:
  - `auth:api` – memastikan request memiliki token valid.
  - `active` – memeriksa `is_active` user.
  - `role:<list>` – mengecek kolom `role` pada tabel users (admin, organisasi, perusahaan).
- **Ownership**: pada controller‑update actions (mis. `OrganizationController@update`) terdapat pemeriksaan `if ($request->user()->id !== $organization->user_id && !$request->user()->hasRole('admin')) abort(403);`.
---

## 9. Daftar Route API Aktual
| Method | URI | Controller | Middleware |
|--------|-----|------------|------------|
| POST | /v1/auth/register | AuthController@register | – |
| POST | /v1/auth/login | AuthController@login | – |
| POST | /v1/auth/logout | AuthController@logout | auth:api, active |
| GET | /v1/auth/me | AuthController@me | auth:api, active |
| GET | /v1/location/provinces | LocationController@provinces | – |
| GET | /v1/location/cities/{province_id} | LocationController@cities | – |
| GET | /v1/organizations | OrganizationController@index | auth:api, active, role:admin |
| GET | /v1/organizations/{id} | OrganizationController@show | auth:api, active, role:admin,organisasi |
| PUT | /v1/organizations/{id} | OrganizationController@update | auth:api, active, role:organisasi |
| GET | /v1/companies | CompanyController@index | auth:api, active, role:admin,organisasi |
| GET | /v1/companies/{id} | CompanyController@show | auth:api, active, role:admin,organisasi |
| PUT | /v1/companies/{id} | CompanyController@update | auth:api, active, role:perusahaan |
| GET | /v1/events | EventController@index | auth:api, active, role:admin,organisasi |
| POST | /v1/events | EventController@store | auth:api, active, role:organisasi |
| PUT | /v1/events/{id} | EventController@update | auth:api, active, role:organisasi |
| DELETE | /v1/events/{id} | EventController@destroy | auth:api, active, role:organisasi |
| PUT | /v1/events/{id}/status | EventController@updateStatus | auth:api, active, role:organisasi |
| POST | /v1/events/{id}/proposal | EventController@uploadProposal | auth:api, active, role:organisasi |
| POST | /v1/sponsorships | SponsorshipController@store | auth:api, active, role:organisasi |
| PUT | /v1/sponsorships/{id}/cancel | SponsorshipController@cancel | auth:api, active, role:organisasi |
| GET | /v1/sponsorships | SponsorshipController@index | auth:api, active, role:admin,organisasi,perusahaan |
| GET | /v1/sponsorships/{id} | SponsorshipController@show | auth:api, active, role:admin,organisasi,perusahaan |
| PUT | /v1/sponsorships/{id}/decide | SponsorshipController@decide | auth:api, active, role:perusahaan |
| … (bookmark, notification, pitching, admin) … |

*Full list is present in `backend/routes/api.php`.*
---

## 10. Swagger URL & Potensi Mismatch Route
- Swagger UI di‑expose melalui package **l5‑swagger** pada route `GET /api/docs` (default).
- Karena route dideklarasikan dengan prefix `v1`, dokumentasi menampilkan endpoint **tanpa** prefix (`/auth/login` vs `/v1/auth/login`). Hal ini dapat menyebabkan kebingungan pada konsumen API yang membaca Swagger.
---

## 11. Daftar Halaman Frontend & Route‑nya
| Halaman | React Router Path | Komponen File |
|---------|-------------------|----------------|
| Landing (home) | `/` | `src/pages/Landing.tsx` |
| Login | `/login` | `src/routes/Login.tsx` |
| Register | `/register` | `src/routes/Register.tsx` |
| Dashboard (organisasi) | `/dashboard` | `src/pages/DashboardOrganisasi.tsx` |
| Event Detail | `/events/:id` | `src/pages/EventDetail.tsx` |
| Sponsorship List | `/sponsorships` | `src/pages/SponsorshipList.tsx` |
| Admin Dashboard | `/admin/dashboard` | `src/pages/Admin/Dashboard.tsx` |
| … | … | … |
---

## 12. Komponen Reusable Frontend
- **Navbar** (`TopNavbar.tsx`, `LandingNavbar.tsx`)
- **Sidebar** (`AdminSidebar.tsx`)
- **Footer** (`LandingLayout.tsx` footer section)
- **Modal** (`components/ui/Modal.tsx`)
- **FormInput** (`components/ui/FormInput.tsx`)
- **Button** (`components/ui/Button.tsx`)
- **Table** (`components/ui/Table.tsx`)
- **Avatar** (`@radix-ui/react-avatar` wrapper)
- **NotificationToast** (`components/ui/Toast.tsx` using `sonner`)
---

## 13. API yang Dipakai Tiap Halaman
| Halaman | API yang Dipanggil |
|---------|-------------------|
| Login | `POST /v1/auth/login` |
| Register | `POST /v1/auth/register` |
| Dashboard (organisasi) | `GET /v1/events`, `GET /v1/organizations/{id}` |
| Event Detail | `GET /v1/events/{id}` |
| Create Event (form) | `POST /v1/events` |
| Upload Proposal | `POST /v1/events/{id}/proposal` |
| Sponsorship List | `GET /v1/sponsorships` |
| Admin Users | `GET /v1/admin/users` (via AdminController) |
| Notification panel | `GET /v1/notifications` |
---

## 14. Integrasi API Wilayah Indonesia
Implemented in **`LocationController`**:
- `GET /v1/location/provinces` → mengembalikan semua provinsi (hard‑coded / dari external API).
- `GET /v1/location/cities/{province_id}` → mengembalikan kota/kabupaten pada provinsi tersebut.
Frontend menggunakan hook `useProvinces` / `useCities` di `src/hooks/location.ts` dan menampilkan dropdown pada form profil.
---

## 15. Upload File Proposal & Logo
- **Frontend**: komponen `FileUploader` (React + `axios` multipart) yang mengirimkan `FormData` dengan field `proposal` ke endpoint `POST /v1/events/{id}/proposal`.
- **Backend**: `EventController@uploadProposal` menerima request, memvalidasi file (`mimes:pdf,docx,doc`), menyimpan ke `storage/app/public/proposals` dan memperbarui kolom `proposal_path` pada tabel `events`.
- **Logo**: gambar logo (`eventoraLogo.png`) berada di `frontend/public/assets/`. Tidak ada endpoint khusus karena logo bersifat statis.
---

## 16. Flow Aktual: Register → Login → Complete Profile
1. **Register** (`POST /v1/auth/register`)
   - Input: `email`, `password`, `role`.
   - Backend membuat user, mengirim email verifikasi (opsional).
2. **Login** (`POST /v1/auth/login`)
   - Mengembalikan JWT token.
3. **Complete Profile** (frontend UI pada `/profile`)
   - User mengisi data organisasi atau perusahaan tergantung `role`.
   - Form meng‑POST ke:
     - `POST /v1/organizations` atau `POST /v1/companies` (controller membuat record dengan `user_id` = authenticated user).
   - Setelah sukses, frontend mengarahkan ke dashboard yang menampilkan data profil.

---

*Seluruh informasi di atas di‑generate secara otomatis dari kode sumber yang ada pada repository.*
