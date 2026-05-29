# FLOW.md
# Eventora - Business Rules, UI Flow, and Development Priority

## Document Metadata

| Field | Detail |
|---|---|
| Project | Eventora |
| Product Type | Platform Digital Sponsorship Management System |
| Document Type | FLOW.md |
| Source Document | PRD.md |
| Purpose | Menjadi panduan alur bisnis, alur UI, dan prioritas development untuk AI-assisted coding |
| Target Users | Frontend Developer, Backend Developer, AI Coding Agent, Tester, Dokumentator |
| Tech Stack | Laravel 11, React Vite, Tailwind CSS, MySQL, JWT Authentication |
| Scope | MVP Release untuk UAS API dan UAS Web Lanjut |

---

## 1. Fungsi Dokumen Ini

FLOW.md ini adalah gabungan dari:

1. **BUSINESS_RULES.md**  
   Menjelaskan aturan bisnis sistem Eventora, termasuk role, status, validasi, batasan akses, dan aturan perubahan data.

2. **UI_FLOW.md**  
   Menjelaskan alur penggunaan sistem dari sisi pengguna, halaman, navigasi, kondisi data, dan aksi yang tersedia.

3. **DEVELOPMENT_PRIORITY.md**  
   Menjelaskan urutan pengembangan fitur agar proyek bisa selesai dalam waktu 1 minggu dan tetap layak didemokan.

Dokumen ini harus digunakan oleh AI coding agent sebelum membuat kode agar implementasi tidak keluar dari konsep Eventora.

---

## 2. Konsep Inti Sistem

Eventora adalah platform digital yang mempertemukan:

| Role | Fungsi Utama |
|---|---|
| Admin | Mengelola platform, user, event, sponsorship, dan laporan |
| Organisasi | Membuat event, upload proposal, mencari perusahaan, dan mengajukan sponsor |
| Perusahaan | Menerima pengajuan sponsor, meninjau proposal, dan memberi keputusan |

Konsep utama sistem:

```text
1 organisasi dapat memiliki banyak event
1 event memiliki 1 proposal utama berbentuk PDF
1 event dapat diajukan ke banyak perusahaan
1 event tidak boleh diajukan dua kali ke perusahaan yang sama
setiap pengajuan sponsorship memiliki cover letter yang berbeda
perusahaan dapat menerima atau menolak pengajuan
keputusan accepted atau rejected bersifat final
admin dapat memonitor semua aktivitas sistem
```

---

## 3. Global System Flow

```text
User membuka landing page
        |
        v
User register sebagai organisasi atau perusahaan
        |
        v
User login menggunakan JWT
        |
        v
Sistem membaca role user
        |
        +----------------------------+
        |                            |
        v                            v
Organisasi                    Perusahaan
melengkapi profil             melengkapi profil
        |                            |
        v                            v
Membuat event                 Melihat request sponsorship
        |                            |
        v                            |
Upload proposal PDF           |
        |                            |
        v                            |
Mencari perusahaan            |
        |                            |
        v                            |
Apply sponsorship ------------+
        |
        v
Perusahaan review proposal
        |
        +------------------+
        |                  |
        v                  v
Accepted              Rejected
        |
        v
Organisasi melihat kontak perusahaan
        |
        v
Negosiasi lanjutan atau pitching
```

---

## 4. Role and Access Flow

### 4.1 Role Admin

Admin adalah pengelola utama platform. Admin dapat melihat semua data, tetapi tidak boleh ikut mengambil keputusan sponsorship.

Admin dapat:

```text
melihat dashboard statistik
melihat semua organisasi
melihat semua perusahaan
melihat semua event
melihat semua sponsorship
melakukan ban user
menghapus user
melakukan hide atau remove event
melakukan export laporan
```

Admin tidak dapat:

```text
mengirim sponsorship
menerima sponsorship
menolak sponsorship
mengubah status sponsorship milik perusahaan
membuat event atas nama organisasi
```

---

### 4.2 Role Organisasi

Organisasi adalah user yang membuat event dan mencari sponsor.

Organisasi dapat:

```text
melengkapi profil organisasi
membuat event
mengedit event miliknya sendiri
upload proposal PDF
publish event
archive event
mencari perusahaan
bookmark perusahaan
apply sponsorship
cancel sponsorship selama pending atau reviewed
melihat status sponsorship
melihat notifikasi
menjadwalkan pitching jika sponsorship accepted
```

Organisasi tidak dapat:

```text
melihat data organisasi lain secara bebas
mengubah data perusahaan
menerima atau menolak sponsorship
mengubah keputusan perusahaan
menghapus event yang sudah memiliki sponsorship aktif
apply dua kali ke perusahaan yang sama untuk event yang sama
```

---

### 4.3 Role Perusahaan

Perusahaan adalah user yang menerima dan menyeleksi pengajuan sponsorship.

Perusahaan dapat:

```text
melengkapi profil perusahaan
melihat request sponsorship yang masuk
membuka detail sponsorship
melihat proposal PDF
melihat cover letter
melihat profil organisasi pengirim
accept sponsorship
reject sponsorship
melihat history sponsorship
melihat notifikasi
melihat detail pitching session yang terkait
```

Perusahaan tidak dapat:

```text
membuat event
apply sponsorship
bookmark perusahaan
melihat semua organisasi tanpa relasi sponsorship
mengubah keputusan setelah accepted atau rejected
mengakses request sponsorship milik perusahaan lain
```

---

## 5. Authentication and Authorization Flow

### 5.1 Register Flow

```text
User membuka /register
        |
        v
User memilih role: organisasi atau perusahaan
        |
        v
User mengisi email dan password
        |
        v
Frontend POST /api/v1/auth/register
        |
        v
Backend validasi data
        |
        v
Backend membuat record users
        |
        +-----------------------------+
        |                             |
        v                             v
Jika role organisasi        Jika role perusahaan
buat record organization    buat record company
        |                             |
        +-------------+---------------+
                      |
                      v
Return success response
                      |
                      v
User diarahkan ke login atau dashboard
```

### 5.2 Login Flow

```text
User membuka /login
        |
        v
User mengisi email dan password
        |
        v
Frontend POST /api/v1/auth/login
        |
        v
Backend validasi kredensial
        |
        v
Backend cek is_active
        |
        +-------------------------------+
        |                               |
        v                               v
is_active true                  is_active false
generate JWT                    return 401 banned
        |
        v
Return token + user data
        |
        v
Frontend simpan token
        |
        v
Redirect berdasarkan role
```

### 5.3 Redirect Berdasarkan Role

| Role | Redirect Setelah Login |
|---|---|
| admin | `/admin/dashboard` |
| organisasi | `/dashboard` atau `/organization/dashboard` |
| perusahaan | `/dashboard` atau `/company/dashboard` |

### 5.4 Authorization Rule

Semua endpoint private wajib menggunakan:

```http
Authorization: Bearer <JWT_TOKEN>
```

Backend wajib mengecek:

```text
Token valid
User aktif
Role sesuai endpoint
Ownership sesuai resource
```

Contoh ownership:

```text
Organisasi hanya boleh edit event miliknya sendiri
Perusahaan hanya boleh melihat sponsorship yang dikirim ke perusahaannya sendiri
Admin boleh melihat semua data tetapi tidak boleh memutuskan sponsorship
```

---

## 6. Account Business Rules

### 6.1 Account Status

| Field | Value | Arti |
|---|---|---|
| `is_active` | true | User dapat login dan menggunakan sistem |
| `is_active` | false | User di-ban dan tidak dapat login |
| `is_verified` | true | Profil sudah lengkap |
| `is_verified` | false | Profil belum lengkap |

### 6.2 Auto Verification Rule

User akan otomatis mendapatkan `is_verified = true` jika profil wajib telah lengkap.

Untuk organisasi, field wajib minimal:

```text
name
description
category
province
city
address
email
phone
```

Untuk perusahaan, field wajib minimal:

```text
name
industry
description
province
city
address
email
support_types_offered
sponsorship_preferences
```

### 6.3 Banned Account Rule

Jika admin melakukan ban:

```text
users.is_active = false
```

Efek sistem:

```text
user tidak dapat login
token lama harus dianggap tidak valid
semua request private dari user tersebut harus return 401
data user tidak langsung dihapus
```

### 6.4 Delete Account Rule

Jika admin menghapus akun:

```text
user dihapus permanen
record profile ikut terhapus karena cascade
data terkait ikut mengikuti aturan foreign key
```

Catatan penting:

```text
Untuk MVP, delete permanen boleh digunakan.
Untuk production, sebaiknya menggunakan soft delete.
```

---

## 7. Event Business Rules

### 7.1 Event Ownership

```text
Event hanya boleh dibuat oleh organisasi
Event selalu terhubung ke organizations.id
Perusahaan tidak boleh membuat event
Admin tidak membuat event
```

### 7.2 Event Creation Rule

Organisasi hanya bisa membuat event jika:

```text
sudah login
role = organisasi
profil organisasi ada
form event valid
proposal PDF valid jika diwajibkan saat create
```

### 7.3 Required Event Fields

```text
name
description
target_audience
participant_count
province
city
event_date
category
support_types_needed
budget_range
proposal_path
```

### 7.4 Event Status

| Status | Arti | Aktor yang Bisa Mengubah |
|---|---|---|
| `draft` | Event baru dibuat dan belum aktif | Organisasi |
| `active` | Event aktif dan bisa diajukan ke sponsor | Organisasi |
| `archived` | Event diarsipkan oleh organisasi | Organisasi |
| `hidden` | Event disembunyikan oleh admin | Admin |
| `removed` | Event dihapus atau dinonaktifkan permanen oleh admin | Admin |

### 7.5 Event Status Flow

```text
DRAFT
  |
  | publish by organisasi
  v
ACTIVE
  |
  | archive by organisasi
  v
ARCHIVED
  |
  | reactivate by organisasi
  v
ACTIVE
```

Admin moderation flow:

```text
ACTIVE or DRAFT or ARCHIVED
  |
  | hide by admin
  v
HIDDEN
  |
  | approve by admin
  v
ACTIVE
```

Remove flow:

```text
ANY STATUS
  |
  | remove by admin
  v
REMOVED
```

### 7.6 Event Delete Rule

Organisasi boleh menghapus event jika:

```text
event milik organisasi tersebut
status event = draft atau archived
tidak memiliki sponsorship aktif
```

Sponsorship aktif berarti:

```text
pending
reviewed
accepted
```

Organisasi tidak boleh menghapus event jika:

```text
sudah pernah accepted
masih pending
sedang reviewed
event disembunyikan admin
event removed
```

Jika tidak bisa delete, sistem menyarankan:

```text
Archive event
```

### 7.7 Event Proposal Rule

```text
1 event memiliki 1 proposal utama
proposal berbentuk PDF
maksimal 10 MB
proposal disimpan di storage/app/public/proposals/
proposal dapat di-update oleh organisasi pemilik event
proposal harus bisa diakses oleh perusahaan yang menerima sponsorship application
```

---

## 8. Sponsorship Business Rules

### 8.1 Core Rule

Sponsorship application adalah inti utama sistem Eventora.

```text
1 sponsorship application menghubungkan:
event
organization
company
support_type_requested
cover_letter
status
response_message
```

### 8.2 Apply Sponsorship Rule

Organisasi dapat apply sponsorship jika:

```text
role = organisasi
event milik organisasi tersebut
event status = active
event memiliki proposal PDF
company_id valid
cover_letter minimal 50 karakter
support_type_requested valid
belum pernah apply event yang sama ke company yang sama
```

### 8.3 Duplicate Application Rule

Tidak boleh ada data duplikat:

```text
event_id + company_id harus unique
```

Valid:

```text
Event A apply ke Company 1
Event A apply ke Company 2
Event B apply ke Company 1
```

Tidak valid:

```text
Event A apply ke Company 1
Event A apply lagi ke Company 1
```

Jika duplikat:

```http
422 Unprocessable Entity
```

Pesan:

```json
{
  "success": false,
  "message": "Event ini sudah pernah diajukan ke perusahaan tersebut."
}
```

### 8.4 Sponsorship Status

| Status | Arti | Final |
|---|---|---|
| `pending` | Pengajuan baru dikirim dan belum dibuka perusahaan | No |
| `reviewed` | Perusahaan sudah membuka detail pengajuan | No |
| `accepted` | Pengajuan diterima perusahaan | Yes |
| `rejected` | Pengajuan ditolak perusahaan | Yes |
| `cancelled` | Pengajuan dibatalkan organisasi | Yes |

### 8.5 Sponsorship State Machine

```text
[submit]
   |
   v
PENDING
   |
   | company opens detail
   v
REVIEWED
   |
   +----------------------+
   |                      |
   v                      v
ACCEPTED              REJECTED
```

Cancel flow:

```text
PENDING  -> CANCELLED
REVIEWED -> CANCELLED
```

Forbidden flow:

```text
ACCEPTED -> REJECTED
REJECTED -> ACCEPTED
ACCEPTED -> CANCELLED
REJECTED -> CANCELLED
CANCELLED -> PENDING
CANCELLED -> REVIEWED
```

### 8.6 Auto Reviewed Rule

Ketika perusahaan membuka detail sponsorship:

```text
GET /api/v1/sponsorships/{id}
```

Jika:

```text
user role = perusahaan
sponsorship.company_id = company milik user
status = pending
```

Maka sistem otomatis melakukan:

```text
status = reviewed
reviewed_at = now()
notifikasi dikirim ke organisasi
```

Jika status bukan pending, sistem tidak mengubah status.

### 8.7 Decide Rule

Perusahaan dapat accept atau reject jika:

```text
role = perusahaan
sponsorship milik perusahaan tersebut
status = pending atau reviewed
```

Saat accept:

```text
status = accepted
decided_at = now()
response_message optional
notifikasi dikirim ke organisasi
```

Saat reject:

```text
status = rejected
decided_at = now()
response_message optional
notifikasi dikirim ke organisasi
```

### 8.8 Final Decision Rule

Jika status sudah:

```text
accepted
rejected
cancelled
```

Maka status tidak bisa diubah lagi.

Jika perusahaan mencoba mengubah keputusan:

```http
403 Forbidden
```

Pesan:

```json
{
  "success": false,
  "message": "Keputusan sponsorship sudah final dan tidak dapat diubah."
}
```

### 8.9 Cancel Sponsorship Rule

Organisasi dapat cancel jika:

```text
role = organisasi
sponsorship milik organisasi tersebut
status = pending atau reviewed
```

Organisasi tidak dapat cancel jika:

```text
accepted
rejected
cancelled
```

Saat cancel:

```text
status = cancelled
notifikasi dikirim ke perusahaan
```

---

## 9. Bookmark Business Rules

### 9.1 Bookmark Rule

Organisasi dapat menyimpan perusahaan ke bookmark.

```text
1 organisasi dapat bookmark banyak perusahaan
1 perusahaan dapat dibookmark banyak organisasi
```

### 9.2 Duplicate Bookmark Rule

Tidak boleh ada duplikasi:

```text
organization_id + company_id harus unique
```

Jika organisasi bookmark perusahaan yang sama dua kali, sistem sebaiknya:

```text
tidak membuat data baru
return success dengan pesan "Perusahaan sudah ada di bookmark"
```

### 9.3 Remove Bookmark Rule

Organisasi dapat menghapus bookmark kapan saja.

```text
hapus hanya bookmark milik organisasi yang sedang login
tidak boleh menghapus bookmark milik organisasi lain
```

---

## 10. Notification Business Rules

### 10.1 Notification Type

| Type | Trigger | Penerima |
|---|---|---|
| `sponsorship_received` | Organisasi apply sponsorship | Perusahaan |
| `sponsorship_reviewed` | Perusahaan membuka detail sponsorship | Organisasi |
| `sponsorship_accepted` | Perusahaan accept sponsorship | Organisasi |
| `sponsorship_rejected` | Perusahaan reject sponsorship | Organisasi |
| `sponsorship_cancelled` | Organisasi cancel sponsorship | Perusahaan |
| `pitching_scheduled` | Organisasi menjadwalkan pitching | Perusahaan |

### 10.2 Notification Read Rule

```text
notifikasi baru memiliki is_read = false
user bisa mark one as read
user bisa mark all as read
notifikasi hanya bisa dibaca pemiliknya
```

### 10.3 Notification Badge Rule

Frontend menampilkan badge jumlah unread notification.

```text
badge count = count notifications where user_id = current user and is_read = false
```

---

## 11. Pitching Session Business Rules

### 11.1 Pitching Rule

Pitching hanya boleh dibuat jika:

```text
role = organisasi
sponsorship milik organisasi tersebut
sponsorship status = accepted
belum ada pitching session untuk sponsorship tersebut
```

### 11.2 Pitching Type Rule

Jika type = online:

```text
meet_link wajib diisi
location boleh kosong
```

Jika type = offline:

```text
location wajib diisi
meet_link boleh kosong
```

### 11.3 Pitching Update Rule

Organisasi pembuat pitching dapat mengubah:

```text
type
meet_link
location
scheduled_at
notes
```

Perusahaan hanya dapat melihat pitching, tidak mengubah.

---

## 12. File Upload Business Rules

### 12.1 Proposal PDF

```text
field: proposal_path
allowed type: PDF
max size: 10 MB
storage path: storage/app/public/proposals/
public URL: /storage/proposals/{filename}
```

### 12.2 Logo Organisasi dan Perusahaan

```text
field: logo_path
allowed type: JPG, PNG, WEBP
max size: 10 MB
storage path: storage/app/public/logos/
public URL: /storage/logos/{filename}
```

### 12.3 File Replacement Rule

Jika user mengganti file:

```text
upload file baru
update path di database
hapus file lama jika ada
return file_url terbaru
```

### 12.4 File Access Rule

Proposal PDF dapat dilihat oleh:

```text
organisasi pemilik event
perusahaan yang menerima sponsorship application terkait event tersebut
admin
```

Proposal tidak boleh dilihat oleh:

```text
perusahaan yang tidak menerima pengajuan event tersebut
organisasi lain
public user
```

---

## 13. Location Business Rules

### 13.1 Location Source

Data provinsi dan kota menggunakan API Wilayah Indonesia.

Frontend flow:

```text
load provinces on page mount
user pilih provinsi
load cities by province_id
user pilih kota
submit form
```

### 13.2 Stored Location Data

Database menyimpan:

```text
province
city
```

Untuk MVP, cukup simpan nama provinsi dan kota.

Opsional jika ingin lebih rapi:

```text
province_id
city_id
province_name
city_name
```

### 13.3 Fallback Rule

Jika API wilayah gagal:

```text
tampilkan error ringan
user dapat refresh
jangan submit form jika province atau city kosong
```

---

## 14. Pagination and Infinite Scroll Rules

### 14.1 Infinite Scroll Requirement

Diterapkan pada:

```text
list perusahaan
list event
list sponsorship
history sponsorship
list admin users
list admin events
```

### 14.2 Default Batch

```text
limit = 6 item per request
```

### 14.3 Frontend Behavior

```text
render data pertama saat page load
pasang sentinel di bagian bawah list
jika sentinel terlihat, fetch data berikutnya
tampilkan skeleton loader
jika has_more false, hentikan fetch
```

### 14.4 Backend Response

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 6,
    "total": 24,
    "has_more": true
  }
}
```

---

## 15. Admin Business Rules

### 15.1 Admin Dashboard Rule

Admin dashboard menampilkan:

```text
total organisasi
total perusahaan
total event aktif
total sponsorship
total accepted
total rejected
total pending
aktivitas terbaru
chart sponsorship per bulan
kategori event populer
```

### 15.2 Admin User Management Rule

Admin dapat:

```text
melihat user
filter berdasarkan role
filter berdasarkan status aktif
ban user
unban user
hapus user permanen
```

Admin tidak boleh:

```text
mengubah password user secara langsung tanpa prosedur
login sebagai user lain
membuat keputusan sponsorship
```

### 15.3 Admin Event Moderation Rule

Admin dapat:

```text
approve event
hide event
remove event
view proposal
```

Jika hide:

```text
event.status = hidden
event tidak muncul di daftar aktif untuk organisasi lain atau perusahaan
event tetap terlihat oleh organisasi pemilik dengan label hidden
```

Jika approve:

```text
event.status = active
```

Jika remove:

```text
event.status = removed
event tidak muncul untuk user non-admin
```

### 15.4 Admin Sponsorship Monitoring Rule

Admin dapat melihat semua sponsorship.

Admin tidak boleh:

```text
accept sponsorship
reject sponsorship
cancel sponsorship
mengubah response_message perusahaan
```

---

## 16. UI Flow Overview by Route

### 16.1 Public Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing Page | Menjelaskan Eventora dan CTA register/login |
| `/login` | Login Page | Masuk ke sistem |
| `/register` | Register Page | Membuat akun organisasi/perusahaan |
| `/403` | Forbidden Page | Akses ditolak |
| `/404` | Not Found Page | Halaman tidak ditemukan |

### 16.2 Organization Routes

| Route | Page | Purpose |
|---|---|---|
| `/dashboard` | Organization Dashboard | Melihat ringkasan sponsorship |
| `/events` | Event List | Kelola event |
| `/events/create` | Create Event | Membuat event baru |
| `/events/{id}` | Event Detail | Melihat detail event |
| `/events/{id}/edit` | Edit Event | Mengubah event |
| `/companies` | Company Discovery | Mencari perusahaan sponsor |
| `/companies/{id}` | Company Detail | Melihat detail perusahaan |
| `/companies/{id}/apply` | Apply Sponsorship | Mengajukan sponsor ke perusahaan |
| `/sponsorships` | Sponsorship Tracking | Melihat status sponsorship |
| `/sponsorships/{id}` | Sponsorship Detail | Melihat detail pengajuan |
| `/bookmarks` | Bookmark Sponsor | Melihat perusahaan favorit |
| `/notifications` | Notifications | Melihat notifikasi |
| `/account` | Account Profile | Mengelola profil organisasi |

### 16.3 Company Routes

| Route | Page | Purpose |
|---|---|---|
| `/dashboard` | Company Dashboard | Melihat request sponsorship masuk |
| `/sponsorships` | Request List | Daftar pengajuan sponsorship |
| `/sponsorships/{id}` | Request Detail | Review proposal dan cover letter |
| `/history` | Sponsorship History | Riwayat accepted/rejected/reviewed |
| `/notifications` | Notifications | Melihat notifikasi |
| `/account` | Company Profile | Mengelola profil perusahaan |

### 16.4 Admin Routes

| Route | Page | Purpose |
|---|---|---|
| `/admin/dashboard` | Admin Dashboard | Statistik platform |
| `/admin/users` | User Management | Mengelola semua user |
| `/admin/organizations` | Organization Management | Mengelola organisasi |
| `/admin/companies` | Company Management | Mengelola perusahaan |
| `/admin/events` | Event Management | Moderasi event |
| `/admin/sponsorships` | Sponsorship Monitoring | Monitoring semua pengajuan |
| `/admin/reports` | Report Page | Export laporan |
| `/admin/account` | Admin Account | Profil admin |

---

## 17. Public UI Flow

### 17.1 Landing Page Flow

```text
User membuka /
        |
        v
Melihat hero section Eventora
        |
        v
Melihat value proposition
        |
        v
Melihat cara kerja platform
        |
        +------------------------+
        |                        |
        v                        v
Klik Daftar                Klik Masuk
        |                        |
        v                        v
/register                  /login
```

Landing page harus menjelaskan:

```text
apa itu Eventora
untuk siapa Eventora dibuat
cara kerja organisasi
cara kerja perusahaan
manfaat platform
CTA register
CTA login
```

---

## 18. Organization UI Flow

### 18.1 Organization First Time Flow

```text
Organisasi login pertama kali
        |
        v
Sistem cek profil organisasi
        |
        +-------------------------------+
        |                               |
        v                               v
Profil belum lengkap             Profil lengkap
redirect /account                redirect /dashboard
        |
        v
Organisasi isi profil
        |
        v
Submit profil
        |
        v
is_verified = true
        |
        v
redirect /dashboard
```

### 18.2 Organization Dashboard Flow

```text
Organisasi membuka /dashboard
        |
        v
Frontend GET /api/v1/organizations/{id}/stats
        |
        v
Tampilkan statistik:
accepted, pending, rejected, reviewed
        |
        v
Tampilkan tracking sponsorship terbaru
        |
        v
Tampilkan quick action:
Buat Event, Cari Sponsor, Bookmark
```

Jika ada sponsorship accepted:

```text
tampilkan card "Sponsorship Diterima"
tampilkan kontak perusahaan
tampilkan CTA "Atur Pitching"
```

### 18.3 Create Event Flow

```text
Organisasi klik Buat Event
        |
        v
Buka /events/create
        |
        v
Isi form event
        |
        v
Upload proposal PDF
        |
        v
Submit form
        |
        v
Frontend POST /api/v1/events
        |
        v
Backend validasi
        |
        +-----------------------+
        |                       |
        v                       v
Valid                     Tidak valid
event tersimpan           tampil error field
status draft
        |
        v
Redirect /events/{id}
```

### 18.4 Publish Event Flow

```text
Event status draft
        |
        v
Organisasi klik Publish
        |
        v
Frontend PUT /api/v1/events/{id}/status
        |
        v
Backend cek:
owner valid
proposal ada
field wajib lengkap
        |
        v
status = active
        |
        v
Event siap diajukan ke sponsor
```

### 18.5 Company Discovery Flow

```text
Organisasi membuka /companies
        |
        v
Load list company limit 6
        |
        v
User dapat filter:
province, city, industry, support_type, search
        |
        v
Klik company card
        |
        v
Buka /companies/{id}
```

### 18.6 Apply Sponsorship Flow

```text
Organisasi membuka detail perusahaan
        |
        v
Klik Apply Sponsor
        |
        v
Buka /companies/{id}/apply
        |
        v
Pilih event aktif
        |
        v
Pilih bentuk dukungan
        |
        v
Isi cover letter
        |
        v
Isi pesan tambahan optional
        |
        v
Submit
        |
        v
Frontend POST /api/v1/sponsorships
        |
        v
Backend validasi business rules
        |
        +-----------------------+
        |                       |
        v                       v
Valid                     Error
status pending             tampil pesan error
notifikasi company
        |
        v
Redirect /sponsorships
```

### 18.7 Sponsorship Tracking Flow

```text
Organisasi membuka /sponsorships
        |
        v
GET /api/v1/sponsorships
        |
        v
Backend return sponsorship milik organisasi
        |
        v
Tampilkan list status:
pending, reviewed, accepted, rejected, cancelled
        |
        v
User dapat filter status
```

### 18.8 Cancel Sponsorship Flow

```text
Organisasi membuka detail sponsorship
        |
        v
Status pending atau reviewed?
        |
        +-----------------------+
        |                       |
        v                       v
Ya                      Tidak
Tampilkan tombol cancel  Sembunyikan tombol cancel
        |
        v
Klik cancel
        |
        v
Konfirmasi modal
        |
        v
PUT /api/v1/sponsorships/{id}/cancel
        |
        v
status = cancelled
        |
        v
notifikasi ke perusahaan
```

### 18.9 Bookmark Flow

```text
Organisasi membuka /companies
        |
        v
Klik icon bookmark
        |
        +-----------------------+
        |                       |
        v                       v
Belum dibookmark          Sudah dibookmark
POST /bookmarks           DELETE /bookmarks/{id}
        |
        v
UI update tanpa reload
```

---

## 19. Company UI Flow

### 19.1 Company First Time Flow

```text
Perusahaan login pertama kali
        |
        v
Sistem cek profil perusahaan
        |
        +-------------------------------+
        |                               |
        v                               v
Profil belum lengkap             Profil lengkap
redirect /account                redirect /dashboard
        |
        v
Perusahaan isi profil
        |
        v
Submit profil
        |
        v
is_verified = true
        |
        v
redirect /dashboard
```

### 19.2 Company Dashboard Flow

```text
Perusahaan membuka /dashboard
        |
        v
GET /api/v1/sponsorships
        |
        v
Backend return sponsorship yang company_id milik perusahaan
        |
        v
Tampilkan request list
        |
        v
User dapat filter:
status, kategori, lokasi, tanggal, bentuk dukungan
```

### 19.3 Review Sponsorship Flow

```text
Perusahaan klik request card
        |
        v
Buka /sponsorships/{id}
        |
        v
Frontend GET /api/v1/sponsorships/{id}
        |
        v
Backend cek ownership company
        |
        v
Jika status pending:
status = reviewed
reviewed_at = now()
notifikasi ke organisasi
        |
        v
Tampilkan detail:
organisasi, event, proposal, cover letter, kontak
```

### 19.4 Accept Sponsorship Flow

```text
Perusahaan membuka detail request
        |
        v
Klik Accept
        |
        v
Muncul modal response message optional
        |
        v
Submit
        |
        v
PUT /api/v1/sponsorships/{id}/decide
        |
        v
status = accepted
decided_at = now()
notifikasi ke organisasi
        |
        v
Tombol accept/reject hilang
```

### 19.5 Reject Sponsorship Flow

```text
Perusahaan membuka detail request
        |
        v
Klik Reject
        |
        v
Muncul modal response message optional
        |
        v
Submit
        |
        v
PUT /api/v1/sponsorships/{id}/decide
        |
        v
status = rejected
decided_at = now()
notifikasi ke organisasi
        |
        v
Tombol accept/reject hilang
```

### 19.6 Company History Flow

```text
Perusahaan membuka /history
        |
        v
GET /api/v1/sponsorships?status=accepted/rejected/reviewed/pending
        |
        v
Tampilkan riwayat
        |
        v
User dapat filter status, tanggal, kategori, nama organisasi
```

---

## 20. Admin UI Flow

### 20.1 Admin Dashboard Flow

```text
Admin login
        |
        v
Redirect /admin/dashboard
        |
        v
GET /api/v1/admin/dashboard
        |
        v
Tampilkan:
stats card
chart sponsorship per bulan
chart kategori event populer
recent activity
```

### 20.2 Admin User Management Flow

```text
Admin membuka /admin/users
        |
        v
GET /api/v1/admin/users
        |
        v
Tampilkan semua user
        |
        v
Admin dapat filter role dan status
        |
        +------------------+
        |                  |
        v                  v
Ban user              Delete user
```

Ban user:

```text
Admin klik Ban
        |
        v
PUT /api/v1/admin/users/{id}/ban
        |
        v
is_active = false
        |
        v
user tidak bisa login
```

Delete user:

```text
Admin klik Delete
        |
        v
Modal konfirmasi
        |
        v
DELETE /api/v1/admin/users/{id}
        |
        v
user dihapus permanen
```

### 20.3 Admin Event Moderation Flow

```text
Admin membuka /admin/events
        |
        v
GET /api/v1/admin/events
        |
        v
Tampilkan semua event
        |
        +------------+-------------+-------------+
        |            |             |
        v            v             v
Approve      Hide Event       Remove Event
```

Approve:

```text
status = active
```

Hide:

```text
status = hidden
```

Remove:

```text
status = removed
```

### 20.4 Admin Sponsorship Monitoring Flow

```text
Admin membuka /admin/sponsorships
        |
        v
GET /api/v1/admin/sponsorships
        |
        v
Tampilkan semua sponsorship
        |
        v
Filter:
status, tanggal, organisasi, perusahaan
        |
        v
Admin hanya view detail
```

### 20.5 Admin Report Flow

```text
Admin membuka /admin/reports
        |
        v
Pilih jenis laporan:
sponsorship, company, organization, event, partnership
        |
        v
Pilih format:
CSV, Excel, PDF
        |
        v
GET /api/v1/admin/reports/export
        |
        v
File terdownload
```

Untuk MVP, prioritas export cukup:

```text
CSV sponsorship report
```

---

## 21. Error Handling Flow

### 21.1 General API Error Response

```json
{
  "success": false,
  "message": "Pesan error yang mudah dipahami",
  "errors": {}
}
```

### 21.2 Common Error Rules

| Scenario | Status Code | UI Response |
|---|---:|---|
| Token tidak ada | 401 | Redirect login |
| Token expired | 401 | Hapus token, redirect login |
| Akun banned | 401 | Tampilkan pesan akun dinonaktifkan |
| Role tidak sesuai | 403 | Redirect 403 |
| Resource bukan miliknya | 403 | Redirect 403 |
| Data tidak ditemukan | 404 | Redirect 404 atau tampil empty state |
| Validasi gagal | 422 | Tampilkan inline error |
| Duplicate apply | 422 | Tampilkan alert bisnis |
| Server error | 500 | Tampilkan toast error umum |

### 21.3 Frontend Auth Interceptor Rule

Axios interceptor harus:

```text
attach token ke setiap request private
jika response 401:
hapus token
hapus user state
redirect ke /login
jika response 403:
redirect ke /403
```

---

## 22. Empty State Rules

### 22.1 Organization Empty States

| Page | Condition | Message | CTA |
|---|---|---|---|
| Dashboard | Belum ada sponsorship | Belum ada pengajuan sponsorship | Cari Sponsor |
| Events | Belum ada event | Anda belum membuat event | Buat Event |
| Bookmarks | Belum ada bookmark | Belum ada perusahaan favorit | Cari Perusahaan |
| Sponsorships | Belum ada apply | Belum ada sponsorship yang diajukan | Apply Sponsor |
| Notifications | Tidak ada notifikasi | Belum ada notifikasi baru | None |

### 22.2 Company Empty States

| Page | Condition | Message | CTA |
|---|---|---|---|
| Dashboard | Belum ada request | Belum ada pengajuan sponsorship masuk | Lengkapi Profil |
| History | Belum ada history | Belum ada riwayat sponsorship | None |
| Notifications | Tidak ada notifikasi | Belum ada notifikasi baru | None |

### 22.3 Admin Empty States

| Page | Condition | Message | CTA |
|---|---|---|---|
| Users | Tidak ada user | Belum ada user terdaftar | None |
| Events | Tidak ada event | Belum ada event dibuat | None |
| Sponsorships | Tidak ada sponsorship | Belum ada sponsorship diajukan | None |

---

## 23. Data Visibility Rules

### 23.1 Public User

Public user hanya dapat melihat:

```text
landing page
login page
register page
```

Public user tidak dapat melihat:

```text
daftar perusahaan
daftar event
proposal
dashboard
sponsorship
notifikasi
```

### 23.2 Organization Visibility

Organisasi dapat melihat:

```text
profil sendiri
event sendiri
daftar perusahaan
detail perusahaan
bookmark sendiri
sponsorship sendiri
notifikasi sendiri
proposal event sendiri
```

Organisasi tidak dapat melihat:

```text
event organisasi lain secara bebas
sponsorship organisasi lain
notifikasi user lain
dashboard admin
```

### 23.3 Company Visibility

Perusahaan dapat melihat:

```text
profil sendiri
request sponsorship masuk ke perusahaannya
detail organisasi yang mengirim request
event yang dikirim ke perusahaannya
proposal terkait request
notifikasi sendiri
history sendiri
```

Perusahaan tidak dapat melihat:

```text
semua organisasi bebas tanpa relasi
request sponsorship perusahaan lain
proposal event yang tidak dikirim ke perusahaannya
bookmark
dashboard admin
```

### 23.4 Admin Visibility

Admin dapat melihat:

```text
semua user
semua organisasi
semua perusahaan
semua event
semua sponsorship
semua laporan
```

Admin tidak dapat:

```text
mengambil keputusan sponsorship atas nama perusahaan
mengajukan sponsorship atas nama organisasi
```

---

## 24. API Flow Mapping

### 24.1 Auth API Flow

| UI Action | Endpoint | Method | Role |
|---|---|---|---|
| Register | `/api/v1/auth/register` | POST | Public |
| Login | `/api/v1/auth/login` | POST | Public |
| Logout | `/api/v1/auth/logout` | POST | All |
| Get current user | `/api/v1/auth/me` | GET | All |

### 24.2 Organization API Flow

| UI Action | Endpoint | Method | Role |
|---|---|---|---|
| Update profile | `/api/v1/organizations/{id}` | PUT | Org own |
| Get stats | `/api/v1/organizations/{id}/stats` | GET | Org own |
| Create event | `/api/v1/events` | POST | Org |
| List events | `/api/v1/events` | GET | Org/Admin |
| Event detail | `/api/v1/events/{id}` | GET | Org/Admin |
| Update event | `/api/v1/events/{id}` | PUT | Org own |
| Delete event | `/api/v1/events/{id}` | DELETE | Org own |
| Update status | `/api/v1/events/{id}/status` | PUT | Org own |
| Upload proposal | `/api/v1/events/{id}/proposal` | POST | Org own |

### 24.3 Company Discovery API Flow

| UI Action | Endpoint | Method | Role |
|---|---|---|---|
| List companies | `/api/v1/companies` | GET | Org/Admin |
| Company detail | `/api/v1/companies/{id}` | GET | Org/Admin |
| Update profile | `/api/v1/companies/{id}` | PUT | Company own |
| Get stats | `/api/v1/companies/{id}/stats` | GET | Company own |

### 24.4 Sponsorship API Flow

| UI Action | Endpoint | Method | Role |
|---|---|---|---|
| Apply sponsorship | `/api/v1/sponsorships` | POST | Org |
| List sponsorship | `/api/v1/sponsorships` | GET | Org/Company/Admin |
| Detail sponsorship | `/api/v1/sponsorships/{id}` | GET | Owner/Admin |
| Decide sponsorship | `/api/v1/sponsorships/{id}/decide` | PUT | Company own |
| Cancel sponsorship | `/api/v1/sponsorships/{id}/cancel` | PUT | Org own |

### 24.5 Bookmark API Flow

| UI Action | Endpoint | Method | Role |
|---|---|---|---|
| List bookmarks | `/api/v1/bookmarks` | GET | Org |
| Add bookmark | `/api/v1/bookmarks` | POST | Org |
| Remove bookmark | `/api/v1/bookmarks/{id}` | DELETE | Org own |

### 24.6 Notification API Flow

| UI Action | Endpoint | Method | Role |
|---|---|---|---|
| List notifications | `/api/v1/notifications` | GET | Org/Company |
| Read one | `/api/v1/notifications/{id}/read` | PUT | Owner |
| Read all | `/api/v1/notifications/read-all` | PUT | Owner |

### 24.7 Admin API Flow

| UI Action | Endpoint | Method | Role |
|---|---|---|---|
| Dashboard stats | `/api/v1/admin/dashboard` | GET | Admin |
| List users | `/api/v1/admin/users` | GET | Admin |
| Ban user | `/api/v1/admin/users/{id}/ban` | PUT | Admin |
| Delete user | `/api/v1/admin/users/{id}` | DELETE | Admin |
| Moderate event | `/api/v1/admin/events/{id}/moderate` | PUT | Admin |
| Sponsorship monitoring | `/api/v1/admin/sponsorships` | GET | Admin |
| Export report | `/api/v1/admin/reports/export` | GET | Admin |

---

## 25. Development Priority

### 25.1 Guiding Principle

Karena timeline hanya 1 minggu, development harus mengikuti prinsip:

```text
core workflow first
nice-to-have later
demo-ready lebih penting daripada fitur banyak tetapi tidak stabil
```

Core workflow utama:

```text
auth
role
profile
event
proposal
company discovery
apply sponsorship
company decision
tracking status
admin monitoring
```

---

## 26. Development Phase 0 - Project Foundation

### Goal

Membuat pondasi agar backend dan frontend bisa berjalan stabil.

### Backend Task

```text
init Laravel 11
setup database MySQL
setup JWT package
setup CORS
setup API route prefix /api/v1
setup standard response helper
setup middleware auth.jwt
setup middleware role
setup repository pattern structure
setup storage link
```

### Frontend Task

```text
init React Vite
setup Tailwind CSS
setup React Router
setup Axios instance
setup auth token storage
setup route guard
setup role-based layout
setup basic component folder
```

### Deliverable

```text
Backend running di localhost:8000
Frontend running di localhost:5173
API health check berjalan
Login route siap
```

Priority:

```text
P0
```

---

## 27. Development Phase 1 - Auth and Role

### Goal

User dapat register, login, logout, dan diarahkan berdasarkan role.

### Backend Features

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET /auth/me
JWT token generation
check is_active
create empty organization/company profile after register
seed admin account
```

### Frontend Features

```text
landing page
register page
login page
protected route
role redirect
dashboard placeholder
logout
```

### Acceptance Criteria

```text
organisasi bisa register dan login
perusahaan bisa register dan login
admin bisa login dari seeder
token tersimpan di frontend
request private membawa bearer token
user banned tidak bisa login
role salah diarahkan ke 403
```

Priority:

```text
P0
```

---

## 28. Development Phase 2 - Profile Completion

### Goal

Organisasi dan perusahaan dapat melengkapi profil dan mendapatkan status verified otomatis.

### Backend Features

```text
GET profile current user
PUT organization profile
PUT company profile
auto set users.is_verified = true jika field wajib lengkap
upload logo optional
```

### Frontend Features

```text
account page
organization profile form
company profile form
inline validation
success toast
verified badge
```

### Acceptance Criteria

```text
organisasi bisa update profil
perusahaan bisa update profil
is_verified berubah true setelah profil lengkap
profil incomplete tetap false
logo valid bisa diupload
file lebih dari 10MB ditolak
```

Priority:

```text
P0
```

---

## 29. Development Phase 3 - Event Management

### Goal

Organisasi dapat membuat, mengelola, dan mempublish event.

### Backend Features

```text
POST /events
GET /events
GET /events/{id}
PUT /events/{id}
DELETE /events/{id}
PUT /events/{id}/status
POST /events/{id}/proposal
event ownership policy
proposal file validation
```

### Frontend Features

```text
event list page
create event form
edit event form
event detail page
upload proposal input
publish button
archive button
delete button with confirmation
```

### Acceptance Criteria

```text
organisasi dapat membuat event
event default draft
proposal PDF tersimpan
event bisa publish ke active
event bisa archive
organisasi tidak bisa mengedit event milik user lain
event dengan sponsorship aktif tidak bisa dihapus
```

Priority:

```text
P0
```

---

## 30. Development Phase 4 - Company Discovery and Bookmark

### Goal

Organisasi dapat mencari perusahaan dan menyimpan sponsor favorit.

### Backend Features

```text
GET /companies
GET /companies/{id}
filter by province
filter by city
filter by industry
filter by support_type
search by company name
GET /bookmarks
POST /bookmarks
DELETE /bookmarks/{id}
```

### Frontend Features

```text
company list page
filter bar
company card
company detail page
bookmark toggle
bookmark page
infinite scroll or pagination
```

### Acceptance Criteria

```text
organisasi dapat melihat list perusahaan
filter berjalan
search berjalan
bookmark dapat ditambah
bookmark dapat dihapus
duplikasi bookmark tidak membuat data ganda
```

Priority:

```text
P1
```

Catatan:

```text
Jika waktu sangat terbatas, bookmark dapat dipindah ke P2.
Company discovery tetap P0 karena dibutuhkan untuk apply sponsorship.
```

---

## 31. Development Phase 5 - Apply Sponsorship

### Goal

Organisasi dapat mengajukan sponsorship ke perusahaan.

### Backend Features

```text
POST /sponsorships
GET /sponsorships
GET /sponsorships/{id}
PUT /sponsorships/{id}/cancel
duplicate rule event_id + company_id
status default pending
notification sponsorship_received
```

### Frontend Features

```text
apply sponsorship form
event active dropdown
support type dropdown
cover letter textarea
additional message textarea
sponsorship tracking page
sponsorship detail page
cancel sponsorship button
```

### Acceptance Criteria

```text
organisasi bisa apply ke perusahaan
status awal pending
perusahaan menerima notifikasi
apply duplikat ditolak
apply event berbeda ke perusahaan sama diperbolehkan
cancel hanya bisa pending/reviewed
```

Priority:

```text
P0
```

---

## 32. Development Phase 6 - Company Review and Decision

### Goal

Perusahaan dapat meninjau, menerima, atau menolak pengajuan.

### Backend Features

```text
GET /sponsorships untuk company
GET /sponsorships/{id} auto-reviewed
PUT /sponsorships/{id}/decide
final decision guard
notification sponsorship_reviewed
notification sponsorship_accepted
notification sponsorship_rejected
```

### Frontend Features

```text
company dashboard
request list
request detail
proposal preview/download
cover letter section
accept modal
reject modal
history page
```

### Acceptance Criteria

```text
perusahaan melihat request miliknya
membuka detail mengubah pending menjadi reviewed
accept mengubah status menjadi accepted
reject mengubah status menjadi rejected
accepted/rejected tidak bisa diubah
organisasi menerima notifikasi status
```

Priority:

```text
P0
```

---

## 33. Development Phase 7 - Notifications

### Goal

User dapat melihat notifikasi dari aktivitas sponsorship.

### Backend Features

```text
GET /notifications
PUT /notifications/{id}/read
PUT /notifications/read-all
unread count
notification creation from sponsorship events
```

### Frontend Features

```text
notification bell
badge unread count
notification dropdown optional
notification page
mark as read
mark all as read
```

### Acceptance Criteria

```text
notifikasi muncul saat apply
notifikasi muncul saat reviewed
notifikasi muncul saat accepted/rejected
notifikasi muncul saat cancelled
badge unread count akurat
user hanya melihat notifikasi sendiri
```

Priority:

```text
P1
```

---

## 34. Development Phase 8 - Admin Panel

### Goal

Admin dapat memonitor dan mengelola platform.

### Backend Features

```text
GET /admin/dashboard
GET /admin/users
PUT /admin/users/{id}/ban
DELETE /admin/users/{id}
PUT /admin/events/{id}/moderate
GET /admin/sponsorships
GET /admin/reports/export
```

### Frontend Features

```text
admin layout
admin dashboard
stats cards
chart optional
user list
event list
sponsorship monitoring
report export page
```

### Acceptance Criteria

```text
admin bisa melihat statistik
admin bisa melihat semua user
admin bisa ban user
admin bisa hide/remove/approve event
admin bisa monitoring sponsorship
admin tidak bisa accept/reject sponsorship
```

Priority:

```text
P1
```

Catatan:

```text
Untuk MVP, admin dashboard dan sponsorship monitoring cukup.
Export dan chart bisa menjadi bonus.
```

---

## 35. Development Phase 9 - Pitching Session

### Goal

Organisasi dapat menjadwalkan pitching setelah sponsorship diterima.

### Backend Features

```text
POST /pitching
GET /pitching/{id}
PUT /pitching/{id}
validate sponsorship status accepted
validate online/offline type
notification pitching_scheduled
```

### Frontend Features

```text
schedule pitching form
pitching detail card
online/offline conditional input
```

### Acceptance Criteria

```text
pitching hanya bisa dibuat jika sponsorship accepted
online wajib meet_link
offline wajib location
perusahaan menerima notifikasi
```

Priority:

```text
P2
```

Catatan:

```text
Fitur ini bagus untuk nilai tambah, tetapi tidak wajib untuk demo core sponsorship.
```

---

## 36. Development Phase 10 - Reports and Polish

### Goal

Menyiapkan aplikasi untuk demo, laporan, dan testing.

### Backend Features

```text
Swagger documentation
Postman collection
CSV export
seed realistic data
bug fixing
```

### Frontend Features

```text
responsive polish
loading skeleton
empty state
error page 403 and 404
toast notification
UI consistency
```

### Acceptance Criteria

```text
demo flow berjalan dari register sampai accepted sponsorship
Postman collection bisa digunakan
Swagger dapat dibuka
UI responsive minimal laptop dan mobile
tidak ada critical bug
```

Priority:

```text
P1 to P2
```

---

## 37. MVP Priority Table

| Priority | Feature | Reason |
|---|---|---|
| P0 | Auth JWT | Pondasi semua fitur |
| P0 | Role Middleware | Menentukan akses admin, organisasi, perusahaan |
| P0 | Profile Completion | Dibutuhkan untuk data organisasi dan perusahaan |
| P0 | Event CRUD | Core organisasi |
| P0 | Proposal Upload | Core sponsorship |
| P0 | Company List | Dibutuhkan untuk apply |
| P0 | Apply Sponsorship | Inti sistem |
| P0 | Company Review | Inti sistem |
| P0 | Accept/Reject | Inti sistem |
| P0 | Sponsorship Tracking | Transparansi status |
| P1 | Bookmark | Fitur pendukung organisasi |
| P1 | Notification | Fitur pendukung transparansi |
| P1 | Admin Dashboard | Penting untuk monitoring |
| P1 | Admin User Management | Penting untuk role admin |
| P1 | Admin Event Moderation | Fitur platform management |
| P2 | Pitching Session | Bonus setelah accepted |
| P2 | Export Report | Bonus laporan |
| P2 | Charts | Bonus UI analytics |
| P2 | Infinite Scroll Advanced | Bisa diganti pagination sederhana jika waktu mepet |

---

## 38. Minimum Demo Scenario

Jika hanya sempat membuat demo utama, gunakan skenario berikut:

### Demo User 1 - Organisasi

```text
register organisasi
login organisasi
lengkapi profil
buat event
upload proposal
publish event
lihat daftar perusahaan
apply sponsorship
lihat status pending
```

### Demo User 2 - Perusahaan

```text
login perusahaan
lengkapi profil
lihat request masuk
buka detail request
status otomatis reviewed
lihat proposal dan cover letter
accept sponsorship
```

### Demo User 1 - Organisasi Lagi

```text
lihat status accepted
lihat kontak perusahaan
lihat notifikasi accepted
```

### Demo User 3 - Admin

```text
login admin
lihat dashboard statistik
lihat daftar sponsorship
lihat daftar user
ban user atau hide event sebagai contoh moderasi
```

Demo ini sudah cukup membuktikan:

```text
RESTful API berjalan
JWT authentication berjalan
RBAC berjalan
CRUD berjalan
upload file berjalan
status workflow berjalan
multi-role berjalan
database relasi berjalan
```

---

## 39. Anti-Scope Creep Rules

Agar proyek selesai dalam 1 minggu, jangan menambahkan fitur berikut sebelum P0 selesai:

```text
chat real-time
email notification
forgot password
AI recommendation
rating and review
payment gateway
public event marketplace
advanced matching sponsor
multi-admin permission
audit log detail
cloud deployment
```

Jika P0 belum selesai, jangan mengerjakan:

```text
pitching
export PDF
advanced chart
infinite scroll kompleks
custom animation
```

---

## 40. AI Coding Agent Rules

AI coding agent harus mengikuti aturan berikut:

```text
jangan membuat role selain admin, organisasi, perusahaan
jangan mengganti JWT menjadi Sanctum
jangan mengubah status sponsorship di luar state machine
jangan membuat sponsorship tanpa event_id, company_id, dan organization_id
jangan mengizinkan duplicate event_id + company_id
jangan mengizinkan perusahaan mengubah keputusan final
jangan mengizinkan admin accept/reject sponsorship
jangan membuat proposal lebih dari 1 per event
jangan membiarkan public user mengakses data private
jangan membuat field database baru tanpa alasan jelas
jangan hardcode user id di frontend
jangan melakukan API call langsung di UI component tanpa layer api service
```

---

## 41. Backend Implementation Order

Urutan implementasi backend yang disarankan:

```text
1. Setup project Laravel
2. Setup JWT auth
3. Create migrations
4. Create models and relationships
5. Create seeders
6. Create response helper
7. Create middleware auth and role
8. Create AuthController
9. Create ProfileController
10. Create EventController
11. Create CompanyController
12. Create SponsorshipController
13. Create NotificationController
14. Create AdminController
15. Create PitchingController
16. Add Swagger annotations
17. Test with Postman
```

---

## 42. Frontend Implementation Order

Urutan implementasi frontend yang disarankan:

```text
1. Setup React Vite
2. Setup Tailwind CSS
3. Setup routes
4. Setup Axios instance
5. Setup auth context or auth store
6. Setup protected routes
7. Create layouts by role
8. Create login and register
9. Create account profile pages
10. Create organization event pages
11. Create company discovery pages
12. Create apply sponsorship form
13. Create sponsorship tracking pages
14. Create company request review pages
15. Create notifications
16. Create admin panel
17. Polish UI and responsive behavior
```

---

## 43. Testing Flow

### 43.1 Backend Testing Flow

```text
test register organisasi
test register perusahaan
test login valid
test login invalid
test protected route without token
test role forbidden
test create event
test upload proposal
test apply sponsorship
test duplicate sponsorship
test auto-reviewed
test accept sponsorship
test final decision guard
test cancel sponsorship
test admin dashboard
```

### 43.2 Frontend Testing Flow

```text
test route guard
test role redirect
test form validation
test upload file validation
test API loading state
test error state
test empty state
test responsive layout
test status badge mapping
test notification badge
```

### 43.3 Demo Testing Flow

```text
run backend
run frontend
seed database
login as admin
login as organisasi
login as perusahaan
execute minimum demo scenario
capture screenshots for report
```

---

## 44. Final Definition of Done

Fitur dianggap selesai jika memenuhi:

```text
API endpoint berjalan
validasi backend berjalan
role access benar
frontend page terhubung ke API
loading state ada
error state ada
success feedback ada
data tersimpan di database
Postman test berhasil
tidak ada critical bug saat demo
```

Project dianggap siap demo jika:

```text
organisasi bisa apply sponsorship
perusahaan bisa accept/reject
organisasi bisa melihat status akhir
admin bisa monitoring
Swagger atau Postman tersedia
database seed tersedia
UI cukup rapi dan responsif
```

---

## 45. Summary

FLOW.md ini menjadi panduan utama agar pengembangan Eventora tetap fokus pada inti sistem:

```text
organisasi membuat event
organisasi mengirim proposal sponsorship
perusahaan meninjau proposal
perusahaan menerima atau menolak
organisasi melihat status
admin memonitor platform
```

Prioritas utama adalah menyelesaikan core workflow sponsorship terlebih dahulu. Fitur seperti pitching, export laporan, chart analytics, dan notifikasi lanjutan boleh menjadi tambahan setelah fitur inti stabil.
