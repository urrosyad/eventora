<?php

namespace App\Services;

use App\Repositories\EventRepository;
use App\Repositories\OrganizationRepository;
use App\Repositories\CompanyRepository;
use App\Models\Event;
use App\Models\SponsorshipApplication;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class EventService
{
    protected EventRepository $eventRepository;
    protected OrganizationRepository $organizationRepository;
    protected CompanyRepository $companyRepository;

    public function __construct(
        EventRepository $eventRepository,
        OrganizationRepository $organizationRepository,
        CompanyRepository $companyRepository
    ) {
        $this->eventRepository = $eventRepository;
        $this->organizationRepository = $organizationRepository;
        $this->companyRepository = $companyRepository;
    }

    public function createEvent(int $userId, array $data): Event
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            throw ValidationException::withMessages(['organization' => 'User does not have an organization profile.']);
        }

        $data['organization_id'] = $org->id;
        $data['status'] = 'draft'; // Newly created events default to draft

        if (isset($data['proposal']) && $data['proposal']->isValid()) {
            $path = $data['proposal']->store('proposals', 'public');
            $data['proposal_path'] = $path;
            unset($data['proposal']);
        }

        return $this->eventRepository->create($data);
    }

    public function updateEvent(int $userId, int $eventId, array $data): ?Event
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            return null;
        }

        $event = $this->eventRepository->findById($eventId);
        if (!$event || $event->organization_id !== $org->id) {
            return null;
        }

        if (isset($data['proposal']) && $data['proposal']->isValid()) {
            if ($event->proposal_path) {
                Storage::disk('public')->delete($event->proposal_path);
            }
            $path = $data['proposal']->store('proposals', 'public');
            $data['proposal_path'] = $path;
            unset($data['proposal']);
        }

        $this->eventRepository->update($eventId, $data);
        return $event->refresh();
    }

    public function deleteEvent(int $userId, int $eventId): bool
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            return false;
        }

        $event = $this->eventRepository->findById($eventId);
        if (!$event || $event->organization_id !== $org->id) {
            return false;
        }

        // Logic check: only draft/archived events without active applications can be deleted
        if (!in_array($event->status, ['draft', 'archived'])) {
            throw ValidationException::withMessages(['status' => 'Hanya event dengan status draft atau archived yang dapat dihapus.']);
        }

        if ($event->hasActiveSponsorships()) {
            throw ValidationException::withMessages(['sponsorship' => 'Event dengan sponsorship aktif tidak dapat dihapus. Harus diarsipkan terlebih dahulu.']);
        }

        if ($event->proposal_path) {
            Storage::disk('public')->delete($event->proposal_path);
        }

        return $this->eventRepository->delete($eventId);
    }

    public function changeStatus(int $userId, int $eventId, string $status): ?Event
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            return null;
        }

        $event = $this->eventRepository->findById($eventId);
        if (!$event || $event->organization_id !== $org->id) {
            return null;
        }

        // Check valid transitions
        // e.g. draft -> active (publish), active -> archived
        if (!in_array($status, ['active', 'archived'])) {
            throw ValidationException::withMessages(['status' => 'Status transisi tidak valid.']);
        }

        $this->eventRepository->update($eventId, ['status' => $status]);
        return $event->refresh();
    }

    public function uploadProposal(int $userId, int $eventId, $file): ?Event
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            return null;
        }

        $event = $this->eventRepository->findById($eventId);
        if (!$event || $event->organization_id !== $org->id) {
            return null;
        }

        if ($event->proposal_path) {
            Storage::disk('public')->delete($event->proposal_path);
        }

        $path = $file->store('proposals', 'public');
        $this->eventRepository->update($eventId, ['proposal_path' => $path]);

        return $event->refresh();
    }

    public function getEventDetail(int $userId, string $role, int $eventId): ?Event
    {
        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            return null;
        }

        if ($role === 'admin') {
            return $event;
        }

        if ($role === 'organisasi') {
            $org = $this->organizationRepository->findByUserId($userId);
            if ($org && $event->organization_id === $org->id) {
                return $event;
            }
        }

        if ($role === 'perusahaan') {
            $company = $this->companyRepository->findByUserId($userId);
            if ($company) {
                // Check if there is an application sent to this company for this event
                $hasApplied = SponsorshipApplication::where('event_id', $eventId)
                    ->where('company_id', $company->id)
                    ->exists();
                if ($hasApplied) {
                    return $event;
                }
            }
        }

        return null;
    }

    public function listEvents(int $userId, string $role, array $filters): CursorPaginator
    {
        if ($role === 'admin') {
            return $this->eventRepository->getAll($filters);
        }

        if ($role === 'organisasi') {
            $org = $this->organizationRepository->findByUserId($userId);
            $filters['organization_id'] = $org ? $org->id : 0;
            return $this->eventRepository->getAll($filters);
        }

        // Perusahaan does not have a direct list all events endpoint except through sponsorships
        return $this->eventRepository->getAll(['limit' => 0]);
    }
}
