<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    use ApiResponse;

    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index(): JsonResponse
    {
        $user = auth()->user();
        $result = $this->notificationService->listNotifications($user->id);

        return $this->success([
            'notifications' => NotificationResource::collection($result['notifications']),
            'unread_count' => $result['unread_count'],
        ], 'Notifikasi berhasil dimuat');
    }

    public function read(int $id): JsonResponse
    {
        $user = auth()->user();
        $success = $this->notificationService->markAsRead($user->id, $id);

        if (!$success) {
            return $this->error('Notifikasi tidak ditemukan', 404);
        }

        return $this->success(null, 'Notifikasi ditandai sebagai dibaca');
    }

    public function readAll(): JsonResponse
    {
        $user = auth()->user();
        $this->notificationService->markAllAsRead($user->id);

        return $this->success(null, 'Semua notifikasi ditandai sebagai dibaca');
    }
}
