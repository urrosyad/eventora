<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePitchingRequest;
use App\Http\Requests\UpdatePitchingRequest;
use App\Http\Resources\PitchingSessionResource;
use App\Services\PitchingSessionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class PitchingSessionController extends Controller
{
    use ApiResponse;

    protected PitchingSessionService $pitchingService;

    public function __construct(PitchingSessionService $pitchingService)
    {
        $this->pitchingService = $pitchingService;
    }

    public function store(StorePitchingRequest $request): JsonResponse
    {
        $user = auth()->user();
        $session = $this->pitchingService->schedulePitching($user->id, $request->validated());

        return $this->success(new PitchingSessionResource($session), 'Sesi pitching berhasil dijadwalkan', 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = auth()->user();
        $session = $this->pitchingService->getDetail($user->id, $user->role, $id);

        if (!$session) {
            return $this->error('Sesi pitching tidak ditemukan atau Anda tidak memiliki akses.', 403);
        }

        return $this->success(new PitchingSessionResource($session));
    }

    public function update(UpdatePitchingRequest $request, int $id): JsonResponse
    {
        $user = auth()->user();
        $session = $this->pitchingService->updateSession($user->id, $id, $request->validated());

        if (!$session) {
            return $this->error('Sesi pitching tidak ditemukan atau Anda bukan pembuat sesi ini.', 403);
        }

        return $this->success(new PitchingSessionResource($session), 'Detail sesi pitching berhasil diperbarui');
    }
}
