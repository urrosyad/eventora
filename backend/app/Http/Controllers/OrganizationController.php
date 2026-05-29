<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateOrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Services\OrganizationService;
use App\Models\Organization;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    use ApiResponse;

    protected OrganizationService $organizationService;

    public function __construct(OrganizationService $organizationService)
    {
        $this->organizationService = $organizationService;
    }

    public function index(Request $request): JsonResponse
    {
        // Admin only list endpoint
        $filters = $request->only(['search', 'category', 'province', 'city', 'limit']);
        $organizations = $this->organizationService->organizationRepository ?? (new \App\Repositories\OrganizationRepository())->getAll($filters);

        // We can just call repository directly here or keep it in service
        $repo = new \App\Repositories\OrganizationRepository();
        $paginated = $repo->getAll($filters);

        return $this->success(
            OrganizationResource::collection($paginated->items()),
            'Daftar organisasi berhasil dimuat',
            200,
            [
                'current_page' => $paginated->cursor()?->encode(),
                'per_page' => $paginated->perPage(),
                'has_more' => $paginated->hasMorePages(),
            ]
        );
    }

    public function show(int $id): JsonResponse
    {
        $user = auth()->user();
        $repo = new \App\Repositories\OrganizationRepository();
        $org = $repo->findById($id);

        if (!$org) {
            return $this->error('Organisasi tidak ditemukan', 404);
        }

        // Authorization: Admin or own profile
        if ($user->role !== 'admin' && ($user->role === 'organisasi' && $org->user_id !== $user->id)) {
            return $this->error('Akses ditolak', 403);
        }

        return $this->success(new OrganizationResource($org));
    }

    public function update(UpdateOrganizationRequest $request, int $id): JsonResponse
    {
        $user = auth()->user();
        $repo = new \App\Repositories\OrganizationRepository();
        $org = $repo->findById($id);

        if (!$org) {
            return $this->error('Organisasi tidak ditemukan', 404);
        }

        if ($org->user_id !== $user->id) {
            return $this->error('Akses ditolak. Anda hanya dapat mengubah profil Anda sendiri.', 403);
        }

        $updated = $this->organizationService->updateProfile($user->id, $request->validated());

        return $this->success(new OrganizationResource($updated), 'Profil organisasi berhasil diperbarui');
    }

    public function stats(int $id): JsonResponse
    {
        $user = auth()->user();
        $repo = new \App\Repositories\OrganizationRepository();
        $org = $repo->findById($id);

        if (!$org) {
            return $this->error('Organisasi tidak ditemukan', 404);
        }

        if ($org->user_id !== $user->id) {
            return $this->error('Akses ditolak.', 403);
        }

        $stats = $this->organizationService->getStats($user->id);

        return $this->success($stats, 'Statistik organisasi berhasil dimuat');
    }
}
