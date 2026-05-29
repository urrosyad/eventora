<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Repositories\EventRepository;
use App\Repositories\SponsorshipApplicationRepository;
use App\Models\User;
use App\Models\Organization;
use App\Models\Company;
use App\Models\Event;
use App\Models\SponsorshipApplication;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Validation\ValidationException;

class AdminService
{
    protected UserRepository $userRepository;
    protected EventRepository $eventRepository;
    protected SponsorshipApplicationRepository $sponsorshipRepository;

    public function __construct(
        UserRepository $userRepository,
        EventRepository $eventRepository,
        SponsorshipApplicationRepository $sponsorshipRepository
    ) {
        $this->userRepository = $userRepository;
        $this->eventRepository = $eventRepository;
        $this->sponsorshipRepository = $sponsorshipRepository;
    }

    public function dashboardStats(string $timeFilter = 'all'): array
    {
        $orgCount = Organization::count();
        $companyCount = Company::count();
        $activeEventCount = Event::where('status', 'active')->count();

        $sponsorshipQuery = SponsorshipApplication::query();
        if ($timeFilter === 'today') {
            $sponsorshipQuery->whereDate('created_at', today());
        } elseif ($timeFilter === '7days') {
            $sponsorshipQuery->where('created_at', '>=', now()->subDays(7));
        } elseif ($timeFilter === '30days') {
            $sponsorshipQuery->where('created_at', '>=', now()->subDays(30));
        }

        $allSponsorships = (clone $sponsorshipQuery)->count();
        $acceptedSponsorships = (clone $sponsorshipQuery)->where('status', 'accepted')->count();
        $rejectedSponsorships = (clone $sponsorshipQuery)->where('status', 'rejected')->count();
        $pendingSponsorships = (clone $sponsorshipQuery)->where('status', 'pending')->count();
        $reviewedSponsorships = (clone $sponsorshipQuery)->where('status', 'reviewed')->count();

        // Recent activity log (mocking log based on real database records)
        $recentUsers = User::orderBy('id', 'desc')->limit(5)->get()->map(function ($u) {
            return [
                'type' => 'user_registered',
                'description' => "Pengguna baru terdaftar dengan email: {$u->email} ({$u->role})",
                'created_at' => $u->created_at,
            ];
        });

        $recentApps = SponsorshipApplication::with(['event', 'company', 'organization'])
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($app) {
                return [
                    'type' => 'sponsorship_applied',
                    'description' => "Organisasi {$app->organization->name} mengajukan sponsor untuk event '{$app->event->name}' ke {$app->company->name}",
                    'created_at' => $app->created_at,
                ];
            });

        $recentEvents = Event::with('organization')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($e) {
                return [
                    'type' => 'event_created',
                    'description' => "Event baru dibuat: '{$e->name}' oleh {$e->organization->name}",
                    'created_at' => $e->created_at,
                ];
            });

        $recentLogs = $recentUsers->concat($recentApps)->concat($recentEvents)
            ->sortByDesc('created_at')
            ->values()
            ->take(8);

        // Chart Analytics data
        $categories = Event::selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->get()
            ->toArray();

        return [
            'stats' => [
                'total_organizations' => $orgCount,
                'total_companies' => $companyCount,
                'total_active_events' => $activeEventCount,
                'sponsorships' => [
                    'all' => $allSponsorships,
                    'accepted' => $acceptedSponsorships,
                    'rejected' => $rejectedSponsorships,
                    'pending' => $pendingSponsorships,
                    'reviewed' => $reviewedSponsorships,
                ],
            ],
            'recent_logs' => $recentLogs,
            'analytics' => [
                'categories' => $categories,
            ],
        ];
    }

    public function listUsers(array $filters): CursorPaginator
    {
        return $this->userRepository->getAll($filters);
    }

    public function banUser(int $userId): ?User
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            return null;
        }

        // Do not allow banning admins
        if ($user->role === 'admin') {
            throw ValidationException::withMessages(['user' => 'Admin tidak dapat di-ban.']);
        }

        $newStatus = !$user->is_active;
        $this->userRepository->update($userId, ['is_active' => $newStatus]);

        return $user->refresh();
    }

    public function deleteUser(int $userId): bool
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            return false;
        }

        if ($user->role === 'admin') {
            throw ValidationException::withMessages(['user' => 'Admin tidak dapat dihapus.']);
        }

        return $this->userRepository->delete($userId);
    }

    public function moderateEvent(int $eventId, string $action): ?Event
    {
        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            return null;
        }

        if ($action === 'approve') {
            $this->eventRepository->update($eventId, ['status' => 'active']);
        } elseif ($action === 'hide') {
            $this->eventRepository->update($eventId, ['status' => 'hidden']);
        } elseif ($action === 'remove') {
            $this->eventRepository->delete($eventId);
            return null;
        } else {
            throw ValidationException::withMessages(['action' => 'Aksi moderasi tidak valid. Harus approve, hide, atau remove.']);
        }

        return $event->refresh();
    }

    public function exportReport(string $type, string $format, ?string $dateRange): string
    {
        // Generates CSV format for simple download
        $output = '';

        if ($type === 'sponsorship') {
            $output .= "ID,Event,Organisasi,Perusahaan,Bentuk Dukungan,Status,Tanggal Diajukan\n";
            $data = SponsorshipApplication::with(['event', 'organization', 'company'])->get();
            foreach ($data as $row) {
                $output .= "{$row->id},\"{$row->event->name}\",\"{$row->organization->name}\",\"{$row->company->name}\",\"{$row->support_type_requested}\",\"{$row->status}\",\"{$row->created_at}\"\n";
            }
        } elseif ($type === 'company') {
            $output .= "ID,Nama Perusahaan,Industri,Provinsi,Kota,Email,Telepon\n";
            $data = Company::get();
            foreach ($data as $row) {
                $output .= "{$row->id},\"{$row->name}\",\"{$row->industry}\",\"{$row->province}\",\"{$row->city}\",\"{$row->email}\",\"{$row->phone}\"\n";
            }
        } elseif ($type === 'organization') {
            $output .= "ID,Nama Organisasi,Kategori,Provinsi,Kota,Email,Telepon\n";
            $data = Organization::get();
            foreach ($data as $row) {
                $output .= "{$row->id},\"{$row->name}\",\"{$row->category}\",\"{$row->province}\",\"{$row->city}\",\"{$row->email}\",\"{$row->phone}\"\n";
            }
        } else {
            // Default event report
            $output .= "ID,Nama Event,Organisasi,Kategori,Peserta,Tanggal,Status\n";
            $data = Event::with('organization')->get();
            foreach ($data as $row) {
                $output .= "{$row->id},\"{$row->name}\",\"{$row->organization->name}\",\"{$row->category}\",{$row->participant_count},\"{$row->event_date}\",\"{$row->status}\"\n";
            }
        }

        return $output;
    }
}
