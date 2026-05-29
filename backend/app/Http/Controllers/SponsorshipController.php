<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSponsorshipRequest;
use App\Http\Requests\DecideSponsorshipRequest;
use App\Http\Resources\SponsorshipApplicationResource;
use App\Services\SponsorshipService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SponsorshipController extends Controller
{
    use ApiResponse;

    protected SponsorshipService $sponsorshipService;

    public function __construct(SponsorshipService $sponsorshipService)
    {
        $this->sponsorshipService = $sponsorshipService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $filters = $request->only(['status', 'event_id', 'search', 'limit']);
        $paginated = $this->sponsorshipService->listApplications($user->id, $user->role, $filters);

        return $this->success(
            SponsorshipApplicationResource::collection($paginated->items()),
            'Daftar pengajuan sponsorship berhasil dimuat',
            200,
            [
                'current_page' => $paginated->cursor()?->encode(),
                'per_page' => $paginated->perPage(),
                'has_more' => $paginated->hasMorePages(),
            ]
        );
    }

    public function store(StoreSponsorshipRequest $request): JsonResponse
    {
        $user = auth()->user();
        $app = $this->sponsorshipService->apply($user->id, $request->validated());

        return $this->success(new SponsorshipApplicationResource($app), 'Pengajuan sponsorship berhasil dikirim', 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = auth()->user();
        $app = $this->sponsorshipService->getDetailAndReview($user->id, $user->role, $id);

        if (!$app) {
            return $this->error('Pengajuan tidak ditemukan atau Anda tidak memiliki akses.', 403);
        }

        return $this->success(new SponsorshipApplicationResource($app));
    }

    public function decide(DecideSponsorshipRequest $request, int $id): JsonResponse
    {
        $user = auth()->user();
        $app = $this->sponsorshipService->decide(
            $user->id,
            $id,
            $request->input('status'),
            $request->input('response_message')
        );

        return $this->success(new SponsorshipApplicationResource($app), 'Keputusan sponsorship berhasil disimpan');
    }

    public function cancel(int $id): JsonResponse
    {
        $user = auth()->user();
        $app = $this->sponsorshipService->cancel($user->id, $id);

        return $this->success(new SponsorshipApplicationResource($app), 'Pengajuan sponsorship berhasil dibatalkan');
    }
}
