<?php

namespace App\Http\Controllers;

use App\Services\LocationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    use ApiResponse;

    protected LocationService $locationService;

    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function provinces(): JsonResponse
    {
        $provinces = $this->locationService->getProvinces();
        return $this->success($provinces, 'Daftar provinsi berhasil dimuat');
    }

    public function cities(string $provinceId): JsonResponse
    {
        $cities = $this->locationService->getCities($provinceId);
        return $this->success($cities, 'Daftar kota/kabupaten berhasil dimuat');
    }
}
