<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Http\Resources\EventResource;
use App\Http\Resources\SponsorshipApplicationResource;
use App\Services\AdminService;
use App\Services\SponsorshipService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminController extends Controller
{
    use ApiResponse;

    protected AdminService $adminService;
    protected SponsorshipService $sponsorshipService;

    public function __construct(AdminService $adminService, SponsorshipService $sponsorshipService)
    {
        $this->adminService = $adminService;
        $this->sponsorshipService = $sponsorshipService;
    }

    public function dashboard(Request $request): JsonResponse
    {
        $timeFilter = $request->input('filter', 'all');
        $stats = $this->adminService->dashboardStats($timeFilter);

        return $this->success($stats, 'Statistik admin berhasil dimuat');
    }

    public function users(Request $request): JsonResponse
    {
        $filters = $request->only(['role', 'is_active', 'is_verified', 'search', 'limit']);
        $paginated = $this->adminService->listUsers($filters);

        return $this->success(
            UserResource::collection($paginated->items()),
            'Daftar pengguna berhasil dimuat',
            200,
            [
                'current_page' => $paginated->cursor()?->encode(),
                'per_page' => $paginated->perPage(),
                'has_more' => $paginated->hasMorePages(),
            ]
        );
    }

    public function ban(int $id): JsonResponse
    {
        $user = $this->adminService->banUser($id);

        if (!$user) {
            return $this->error('Pengguna tidak ditemukan', 404);
        }

        $statusLabel = $user->is_active ? 'diaktifkan' : 'ditangguhkan (banned)';
        return $this->success(new UserResource($user), "Pengguna berhasil {$statusLabel}");
    }

    public function destroy(int $id): JsonResponse
    {
        $success = $this->adminService->deleteUser($id);

        if (!$success) {
            return $this->error('Pengguna tidak ditemukan', 404);
        }

        return $this->success(null, 'Akun pengguna berhasil dihapus secara permanen');
    }

    public function moderateEvent(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'action' => 'required|in:approve,hide,remove',
        ]);

        $action = $request->input('action');
        $event = $this->adminService->moderateEvent($id, $action);

        if ($action === 'remove') {
            return $this->success(null, 'Event berhasil dihapus secara permanen');
        }

        if (!$event) {
            return $this->error('Event tidak ditemukan', 404);
        }

        $actionLabel = $action === 'approve' ? 'disetujui (aktif)' : 'disembunyikan';
        return $this->success(new EventResource($event), "Event berhasil {$actionLabel}");
    }

    public function sponsorships(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'event_id', 'search', 'limit']);
        $paginated = $this->sponsorshipService->listApplications(auth()->id(), 'admin', $filters);

        return $this->success(
            SponsorshipApplicationResource::collection($paginated->items()),
            'Monitoring sponsorship berhasil dimuat',
            200,
            [
                'current_page' => $paginated->cursor()?->encode(),
                'per_page' => $paginated->perPage(),
                'has_more' => $paginated->hasMorePages(),
            ]
        );
    }

    public function export(Request $request): Response
    {
        $request->validate([
            'type' => 'required|in:sponsorship,company,organization,event',
            'format' => 'required|in:csv,excel,pdf', // PDF and excel will download CSV for MVP simplicity
        ]);

        $type = $request->input('type');
        $format = $request->input('format');
        $dateRange = $request->input('range');

        $csvData = $this->adminService->exportReport($type, $format, $dateRange);

        $filename = "laporan_{$type}_" . date('Ymd_His') . ".csv";

        return response($csvData, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
