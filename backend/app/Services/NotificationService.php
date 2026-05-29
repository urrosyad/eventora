<?php

namespace App\Services;

use App\Repositories\NotificationRepository;
use Illuminate\Database\Eloquent\Collection;

class NotificationService
{
    protected NotificationRepository $notificationRepository;

    public function __construct(NotificationRepository $notificationRepository)
    {
        $this->notificationRepository = $notificationRepository;
    }

    public function listNotifications(int $userId): array
    {
        $notifications = $this->notificationRepository->getAllForUser($userId);
        $unreadCount = $this->notificationRepository->getUnreadCountForUser($userId);

        return [
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ];
    }

    public function markAsRead(int $userId, int $id): bool
    {
        $notification = $this->notificationRepository->findById($id);
        if (!$notification || $notification->user_id !== $userId) {
            return false;
        }

        return $this->notificationRepository->markAsRead($id);
    }

    public function markAllAsRead(int $userId): bool
    {
        return $this->notificationRepository->markAllAsRead($userId);
    }
}
