<?php

namespace App\Repositories;

use App\Models\Bookmark;
use Illuminate\Contracts\Pagination\CursorPaginator;

class BookmarkRepository
{
    public function create(array $data): Bookmark
    {
        return Bookmark::create($data);
    }

    public function delete(int $id): bool
    {
        $bookmark = Bookmark::find($id);
        if (!$bookmark) {
            return false;
        }
        return $bookmark->delete();
    }

    public function findById(int $id): ?Bookmark
    {
        return Bookmark::find($id);
    }

    public function findByOrgAndCompany(int $orgId, int $companyId): ?Bookmark
    {
        return Bookmark::where('organization_id', $orgId)
            ->where('company_id', $companyId)
            ->first();
    }

    public function getAllForOrganization(int $orgId, int $limit = 6): CursorPaginator
    {
        return Bookmark::with(['company.user'])
            ->where('organization_id', $orgId)
            ->orderBy('id', 'desc')
            ->cursorPaginate($limit);
    }
}
