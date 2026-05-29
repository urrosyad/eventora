<?php

namespace App\Repositories;

use App\Models\SponsorshipApplication;
use Illuminate\Contracts\Pagination\CursorPaginator;

class SponsorshipApplicationRepository
{
    public function create(array $data): SponsorshipApplication
    {
        return SponsorshipApplication::create($data);
    }

    public function findById(int $id): ?SponsorshipApplication
    {
        return SponsorshipApplication::with(['event', 'company', 'organization', 'pitchingSession'])->find($id);
    }

    public function findByEventAndCompany(int $eventId, int $companyId): ?SponsorshipApplication
    {
        return SponsorshipApplication::where('event_id', $eventId)
            ->where('company_id', $companyId)
            ->first();
    }

    public function update(int $id, array $data): bool
    {
        $application = SponsorshipApplication::find($id);
        if (!$application) {
            return false;
        }
        return $application->update($data);
    }

    public function getAll(array $filters = []): CursorPaginator
    {
        $query = SponsorshipApplication::with(['event', 'company', 'organization', 'pitchingSession']);

        if (!empty($filters['organization_id'])) {
            $query->where('organization_id', $filters['organization_id']);
        }

        if (!empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        if (!empty($filters['event_id'])) {
            $query->where('event_id', $filters['event_id']);
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
            $query->where(function ($q) use ($search) {
                $q->whereHas('event', function ($qe) use ($search) {
                    $qe->where('name', 'like', "%{$search}%");
                })->orWhereHas('company', function ($qc) use ($search) {
                    $qc->where('name', 'like', "%{$search}%");
                })->orWhereHas('organization', function ($qo) use ($search) {
                    $qo->where('name', 'like', "%{$search}%");
                });
            });
        }

        $limit = $filters['limit'] ?? 6;

        return $query->orderBy('id', 'desc')->cursorPaginate($limit);
    }
}
