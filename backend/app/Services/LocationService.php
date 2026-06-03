<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LocationService
{
    private array $fallbackProvinces = [
        ['id' => '31', 'name' => 'DKI JAKARTA'],
        ['id' => '32', 'name' => 'JAWA BARAT'],
        ['id' => '33', 'name' => 'JAWA TENGAH'],
        ['id' => '34', 'name' => 'DI YOGYAKARTA'],
        ['id' => '35', 'name' => 'JAWA TIMUR'],
        ['id' => '36', 'name' => 'BANTEN'],
        ['id' => '51', 'name' => 'BALI'],
    ];

    private array $fallbackCities = [
        '31' => [
            ['id' => '3101', 'province_id' => '31', 'name' => 'KABUPATEN KEPULAUAN SERIBU'],
            ['id' => '3171', 'province_id' => '31', 'name' => 'KOTA JAKARTA SELATAN'],
            ['id' => '3172', 'province_id' => '31', 'name' => 'KOTA JAKARTA TIMUR'],
            ['id' => '3173', 'province_id' => '31', 'name' => 'KOTA JAKARTA PUSAT'],
            ['id' => '3174', 'province_id' => '31', 'name' => 'KOTA JAKARTA BARAT'],
            ['id' => '3175', 'province_id' => '31', 'name' => 'KOTA JAKARTA UTARA'],
        ],
        '32' => [
            ['id' => '3201', 'province_id' => '32', 'name' => 'KABUPATEN BOGOR'],
            ['id' => '3273', 'province_id' => '32', 'name' => 'KOTA BANDUNG'],
            ['id' => '3275', 'province_id' => '32', 'name' => 'KOTA BEKASI'],
            ['id' => '3276', 'province_id' => '32', 'name' => 'KOTA DEPOK'],
        ],
        '35' => [
            ['id' => '3578', 'province_id' => '35', 'name' => 'KOTA SURABAYA'],
            ['id' => '3573', 'province_id' => '35', 'name' => 'KOTA MALANG'],
            ['id' => '3515', 'province_id' => '35', 'name' => 'KABUPATEN SIDOARJO'],
            ['id' => '3525', 'province_id' => '35', 'name' => 'KABUPATEN GRESIK'],
        ],
    ];

    public function getProvinces(): array
    {
        try {
            $response = Http::timeout(5)->get('https://wilayah.id/api/provinces.json');
            if ($response->successful()) {
                $data = $response->json()['data'] ?? [];
                return array_map(function ($item) {
                    return [
                        'id' => $item['code'],
                        'name' => strtoupper($item['name'])
                    ];
                }, $data);
            }
        } catch (\Exception $e) {
            Log::warning('External Location API error: ' . $e->getMessage() . '. Using fallback.');
        }

        return $this->fallbackProvinces;
    }

    public function getCities(string $provinceId): array
    {
        try {
            $response = Http::timeout(5)->get("https://wilayah.id/api/regencies/{$provinceId}.json");
            if ($response->successful()) {
                $data = $response->json()['data'] ?? [];
                return array_map(function ($item) use ($provinceId) {
                    return [
                        'id' => $item['code'],
                        'province_id' => $provinceId,
                        'name' => strtoupper($item['name'])
                    ];
                }, $data);
            }
        } catch (\Exception $e) {
            Log::warning('External Location API regencies error: ' . $e->getMessage() . '. Using fallback.');
        }

        // Return fallback cities if mapped, otherwise default list
        if (isset($this->fallbackCities[$provinceId])) {
            return $this->fallbackCities[$provinceId];
        }

        // Generic mock cities if id is not found in fallbacks
        return [
            ['id' => $provinceId . '01', 'province_id' => $provinceId, 'name' => 'KABUPATEN UTAMA'],
            ['id' => $provinceId . '71', 'province_id' => $provinceId, 'name' => 'KOTA UTAMA'],
        ];
    }
}
