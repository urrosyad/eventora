<?php

namespace App\Repositories;

use App\Models\Organization;
use Illuminate\Contracts\Pagination\CursorPaginator;

class OrganizationRepository
{
    public function findByUserId(int $userId): ?Organization
    {
        return Organization::where('user_id', $userId)->first();
    }

    public function findById(int $id): ?Organization
    {
        return Organization::with('user')->find($id);
    }

    public function create(array $data): Organization
    {
        return Organization::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $organization = Organization::find($id);
        if (!$organization) {
            return false;
        }
        return $organization->update($data);
    }

    public function getAll(array $filters = []): CursorPaginator
    {
        $query = Organization::with(['user']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('province', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['province'])) {
            $query->where('province', $filters['province']);
        }

        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        $limit = $filters['limit'] ?? 6;

        return $query->orderBy('id', 'desc')->cursorPaginate($limit);
    }
}
