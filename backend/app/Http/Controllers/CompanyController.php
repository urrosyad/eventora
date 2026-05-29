<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Services\CompanyService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    use ApiResponse;

    protected CompanyService $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'province', 'city', 'industry', 'support_type', 'limit']);
        $paginated = $this->companyService->listCompanies($filters);

        return $this->success(
            CompanyResource::collection($paginated->items()),
            'Daftar perusahaan berhasil dimuat',
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
        $company = $this->companyService->getCompanyDetail($id);
        if (!$company) {
            return $this->error('Perusahaan tidak ditemukan', 404);
        }

        return $this->success(new CompanyResource($company));
    }

    public function update(UpdateCompanyRequest $request, int $id): JsonResponse
    {
        $user = auth()->user();
        $company = $this->companyService->getCompanyDetail($id);

        if (!$company) {
            return $this->error('Perusahaan tidak ditemukan', 404);
        }

        if ($company->user_id !== $user->id) {
            return $this->error('Akses ditolak. Anda hanya dapat mengubah profil Anda sendiri.', 403);
        }

        $updated = $this->companyService->updateProfile($user->id, $request->validated());

        return $this->success(new CompanyResource($updated), 'Profil perusahaan berhasil diperbarui');
    }

    public function stats(int $id): JsonResponse
    {
        $user = auth()->user();
        $company = $this->companyService->getCompanyDetail($id);

        if (!$company) {
            return $this->error('Perusahaan tidak ditemukan', 404);
        }

        if ($company->user_id !== $user->id) {
            return $this->error('Akses ditolak.', 403);
        }

        $stats = $this->companyService->getStats($user->id);

        return $this->success($stats, 'Statistik perusahaan berhasil dimuat');
    }
}
