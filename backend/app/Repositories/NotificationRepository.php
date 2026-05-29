<?php

namespace App\Repositories;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Collection;

class NotificationRepository
{
    public function create(array $data): Notification
    {
        return Notification::create($data);
    }

    public function findById(int $id): ?Notification
    {
        return Notification::find($id);
    }

    public function markAsRead(int $id): bool
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return false;
        }
        return $notification->update(['is_read' => true]);
    }

    public function markAllAsRead(int $userId): bool
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]) >= 0;
    }

    public function getAllForUser(int $userId, int $limit = 20): Collection
    {
        return Notification::where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getUnreadCountForUser(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }
}
