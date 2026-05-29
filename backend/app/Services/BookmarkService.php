<?php

namespace App\Services;

use App\Repositories\BookmarkRepository;
use App\Repositories\OrganizationRepository;
use App\Repositories\CompanyRepository;
use App\Models\Bookmark;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Validation\ValidationException;

class BookmarkService
{
    protected BookmarkRepository $bookmarkRepository;
    protected OrganizationRepository $organizationRepository;
    protected CompanyRepository $companyRepository;

    public function __construct(
        BookmarkRepository $bookmarkRepository,
        OrganizationRepository $organizationRepository,
        CompanyRepository $companyRepository
    ) {
        $this->bookmarkRepository = $bookmarkRepository;
        $this->organizationRepository = $organizationRepository;
        $this->companyRepository = $companyRepository;
    }

    public function addBookmark(int $userId, int $companyId): Bookmark
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            throw ValidationException::withMessages(['organization' => 'Profil organisasi tidak ditemukan.']);
        }

        $company = $this->companyRepository->findById($companyId);
        if (!$company) {
            throw ValidationException::withMessages(['company_id' => 'Perusahaan tidak ditemukan.']);
        }

        $existing = $this->bookmarkRepository->findByOrgAndCompany($org->id, $company->id);
        if ($existing) {
            throw ValidationException::withMessages(['company_id' => 'Perusahaan sudah ditambahkan ke bookmark sebelumnya.']);
        }

        return $this->bookmarkRepository->create([
            'organization_id' => $org->id,
            'company_id' => $company->id,
            'created_at' => now(),
        ]);
    }

    public function removeBookmark(int $userId, int $bookmarkId): bool
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            return false;
        }

        $bookmark = $this->bookmarkRepository->findById($bookmarkId);
        if (!$bookmark || $bookmark->organization_id !== $org->id) {
            throw ValidationException::withMessages(['bookmark' => 'Bookmark tidak ditemukan atau bukan milik organisasi Anda.']);
        }

        return $this->bookmarkRepository->delete($bookmarkId);
    }

    public function listBookmarks(int $userId, int $limit = 6): CursorPaginator
    {
        $org = $this->organizationRepository->findByUserId($userId);
        $orgId = $org ? $org->id : 0;

        return $this->bookmarkRepository->getAllForOrganization($orgId, $limit);
    }
}
