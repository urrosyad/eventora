<?php

namespace App\Repositories;

use App\Models\Event;
use Illuminate\Contracts\Pagination\CursorPaginator;

class EventRepository
{
    public function create(array $data): Event
    {
        return Event::create($data);
    }

    public function findById(int $id): ?Event
    {
        return Event::with('organization')->find($id);
    }

    public function update(int $id, array $data): bool
    {
        $event = Event::find($id);
        if (!$event) {
            return false;
        }
        return $event->update($data);
    }

    public function delete(int $id): bool
    {
        $event = Event::find($id);
        if (!$event) {
            return false;
        }
        return $event->delete();
    }

    public function getAll(array $filters = []): CursorPaginator
    {
        $query = Event::with('organization');

        if (!empty($filters['organization_id'])) {
            $query->where('organization_id', $filters['organization_id']);
        }

        if (!empty($filters['status'])) {
            if (is_array($filters['status'])) {
                $query->whereIn('status', $filters['status']);
            } else {
                $query->where('status', $filters['status']);
            }
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        $limit = $filters['limit'] ?? 6;

        return $query->orderBy('id', 'desc')->cursorPaginate($limit);
    }
}
