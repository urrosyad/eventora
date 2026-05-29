<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
use App\Models\Company;
use App\Models\Event;
use App\Models\SponsorshipApplication;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin
        User::create([
            'email' => 'admin@eventora.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
            'is_verified' => true,
        ]);

        // 2. Create Organization User
        $orgUser = User::create([
            'email' => 'organisasi@eventora.com',
            'password' => Hash::make('password123'),
            'role' => 'organisasi',
            'is_active' => true,
            'is_verified' => true,
        ]);

        $org = Organization::create([
            'user_id' => $orgUser->id,
            'name' => 'Himpunan Mahasiswa Informatika',
            'description' => 'Himpunan mahasiswa jurusan Manajemen Informatika Eventora.',
            'category' => 'Pendidikan',
            'province' => 'JAWA TIMUR',
            'city' => 'KOTA SURABAYA',
            'address' => 'Jl. Ketintang No. 156, Surabaya',
            'email' => 'hima.if@eventora.com',
            'phone' => '081234567890',
            'website' => 'https://hima.eventora.com',
            'instagram' => 'hima.if',
        ]);

        // 3. Create Company User
        $companyUser = User::create([
            'email' => 'perusahaan@eventora.com',
            'password' => Hash::make('password123'),
            'role' => 'perusahaan',
            'is_active' => true,
            'is_verified' => true,
        ]);

        $company = Company::create([
            'user_id' => $companyUser->id,
            'name' => 'PT Solusi Teknologi Indonesia',
            'industry' => 'Teknologi',
            'description' => 'Perusahaan pengembangan perangkat lunak dan solusi digital.',
            'province' => 'JAWA TIMUR',
            'city' => 'KOTA SURABAYA',
            'address' => 'Intiland Tower Lt. 5, Jl. Panglima Sudirman, Surabaya',
            'email' => 'contact@solusitekno.com',
            'phone' => '0315551234',
            'website' => 'https://solusitekno.com',
            'sponsorship_preferences' => ['Pendidikan', 'Teknologi', 'Kreatif'],
            'support_types_offered' => ['Uang Tunai', 'Merchandise', 'Pembicara'],
        ]);

        // 4. Create another company for browsing / testing
        $otherCompanyUser = User::create([
            'email' => 'info@kreatifindo.com',
            'password' => Hash::make('password123'),
            'role' => 'perusahaan',
            'is_active' => true,
            'is_verified' => true,
        ]);

        Company::create([
            'user_id' => $otherCompanyUser->id,
            'name' => 'PT Kreatif Media Nusantara',
            'industry' => 'Kreatif',
            'description' => 'Agensi media kreatif dan publikasi terkemuka.',
            'province' => 'DKI JAKARTA',
            'city' => 'KOTA JAKARTA SELATAN',
            'address' => 'Menara BTPN Lt. 12, Mega Kuningan, Jakarta Selatan',
            'email' => 'sponsorship@kreatifindo.com',
            'phone' => '0218882929',
            'website' => 'https://kreatifindo.com',
            'sponsorship_preferences' => ['Kreatif', 'Musik', 'Olahraga'],
            'support_types_offered' => ['Media Partner', 'Merchandise', 'Uang Tunai'],
        ]);

        // 5. Create Events for Organization
        $event1 = Event::create([
            'organization_id' => $org->id,
            'name' => 'Informatics Expo & Pitching 2026',
            'description' => 'Pameran karya tugas akhir mahasiswa informatika dan sesi pitching dengan startup.',
            'target_audience' => 'Mahasiswa, Praktisi IT, Startup',
            'participant_count' => 500,
            'province' => 'JAWA TIMUR',
            'city' => 'KOTA SURABAYA',
            'event_date' => '2026-08-15',
            'category' => 'Teknologi',
            'support_types_needed' => ['Uang Tunai', 'Media Partner'],
            'budget_range' => 'Rp 10.000.000 - Rp 25.000.000',
            'status' => 'active',
        ]);

        $event2 = Event::create([
            'organization_id' => $org->id,
            'name' => 'Lomba Desain Antarmuka Nasional',
            'description' => 'Kompetisi desain UI/UX tingkat nasional untuk pelajar dan mahasiswa.',
            'target_audience' => 'Pelajar, Mahasiswa',
            'participant_count' => 200,
            'province' => 'JAWA TIMUR',
            'city' => 'KOTA SURABAYA',
            'event_date' => '2026-10-10',
            'category' => 'Kreatif',
            'support_types_needed' => ['Merchandise', 'Uang Tunai'],
            'budget_range' => 'Rp 5.000.000 - Rp 10.000.000',
            'status' => 'draft',
        ]);

        // 6. Create active sponsorship application
        SponsorshipApplication::create([
            'event_id' => $event1->id,
            'company_id' => $company->id,
            'organization_id' => $org->id,
            'support_type_requested' => 'Uang Tunai',
            'cover_letter' => 'Kami mengajukan sponsorship uang tunai senilai Rp 10.000.000 untuk mendukung kelancaran Informatics Expo & Pitching 2026.',
            'additional_message' => 'Proposal terlampir.',
            'status' => 'pending',
        ]);
    }
}
