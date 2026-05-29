<?php

namespace App\Repositories;

use App\Models\Company;
use Illuminate\Contracts\Pagination\CursorPaginator;

class CompanyRepository
{
    public function findByUserId(int $userId): ?Company
    {
        return Company::where('user_id', $userId)->first();
    }

    public function findById(int $id): ?Company
    {
        return Company::with('user')->find($id);
    }

    public function create(array $data): Company
    {
        return Company::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $company = Company::find($id);
        if (!$company) {
            return false;
        }
        return $company->update($data);
    }

    public function getAll(array $filters = []): CursorPaginator
    {
        $query = Company::with(['user']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        if (!empty($filters['province'])) {
            $query->where('province', $filters['province']);
        }

        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        if (!empty($filters['industry'])) {
            $query->where('industry', $filters['industry']);
        }

        if (!empty($filters['support_type'])) {
            $supportType = $filters['support_type'];
            $query->whereJsonContains('support_types_offered', $supportType);
        }

        $limit = $filters['limit'] ?? 6;

        return $query->orderBy('id', 'desc')->cursorPaginate($limit);
    }
}
