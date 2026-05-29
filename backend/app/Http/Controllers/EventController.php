<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Services\EventService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    use ApiResponse;

    protected EventService $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $filters = $request->only(['status', 'search', 'limit']);
        $paginated = $this->eventService->listEvents($user->id, $user->role, $filters);

        return $this->success(
            EventResource::collection($paginated->items()),
            'Daftar event berhasil dimuat',
            200,
            [
                'current_page' => $paginated->cursor()?->encode(),
                'per_page' => $paginated->perPage(),
                'has_more' => $paginated->hasMorePages(),
            ]
        );
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $user = auth()->user();
        $event = $this->eventService->createEvent($user->id, $request->validated());

        return $this->success(new EventResource($event), 'Event berhasil dibuat', 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = auth()->user();
        $event = $this->eventService->getEventDetail($user->id, $user->role, $id);

        if (!$event) {
            return $this->error('Event tidak ditemukan atau Anda tidak memiliki akses ke event ini.', 403);
        }

        return $this->success(new EventResource($event));
    }

    public function update(UpdateEventRequest $request, int $id): JsonResponse
    {
        $user = auth()->user();
        $event = $this->eventService->updateEvent($user->id, $id, $request->validated());

        if (!$event) {
            return $this->error('Event tidak ditemukan atau bukan milik organisasi Anda.', 403);
        }

        return $this->success(new EventResource($event), 'Event berhasil diperbarui');
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth()->user();
        $success = $this->eventService->deleteEvent($user->id, $id);

        if (!$success) {
            return $this->error('Event tidak ditemukan atau bukan milik organisasi Anda.', 403);
        }

        return $this->success(null, 'Event berhasil dihapus');
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:active,archived',
        ]);

        $user = auth()->user();
        $event = $this->eventService->changeStatus($user->id, $id, $request->input('status'));

        if (!$event) {
            return $this->error('Event tidak ditemukan atau bukan milik organisasi Anda.', 403);
        }

        return $this->success(new EventResource($event), 'Status event berhasil diubah');
    }

    public function uploadProposal(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'proposal' => 'required|file|mimes:pdf|max:10240',
        ]);

        $user = auth()->user();
        $event = $this->eventService->uploadProposal($user->id, $id, $request->file('proposal'));

        if (!$event) {
            return $this->error('Event tidak ditemukan atau bukan milik organisasi Anda.', 403);
        }

        return $this->success(new EventResource($event), 'Proposal berhasil diunggah');
    }
}
