<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function findById(int $id): ?User
    {
        return User::with(['organization', 'company'])->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function update(int $id, array $data): bool
    {
        $user = User::find($id);
        if (!$user) {
            return false;
        }
        return $user->update($data);
    }

    public function delete(int $id): bool
    {
        $user = User::find($id);
        if (!$user) {
            return false;
        }
        return $user->delete();
    }

    public function getAll(array $filters = []): CursorPaginator
    {
        $query = User::with(['organization', 'company']);

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['is_verified'])) {
            $query->where('is_verified', $filters['is_verified']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhereHas('organization', function ($qo) use ($search) {
                      $qo->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('company', function ($qc) use ($search) {
                      $qc->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $limit = $filters['limit'] ?? 6;

        return $query->orderBy('id', 'desc')->cursorPaginate($limit);
    }
}
