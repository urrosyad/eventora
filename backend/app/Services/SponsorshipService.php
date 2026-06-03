<?php

namespace App\Services;

use App\Repositories\SponsorshipApplicationRepository;
use App\Repositories\OrganizationRepository;
use App\Repositories\CompanyRepository;
use App\Repositories\EventRepository;
use App\Repositories\NotificationRepository;
use App\Models\SponsorshipApplication;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Validation\ValidationException;

class SponsorshipService
{
    protected SponsorshipApplicationRepository $sponsorshipRepository;
    protected OrganizationRepository $organizationRepository;
    protected CompanyRepository $companyRepository;
    protected EventRepository $eventRepository;
    protected NotificationRepository $notificationRepository;

    public function __construct(
        SponsorshipApplicationRepository $sponsorshipRepository,
        OrganizationRepository $organizationRepository,
        CompanyRepository $companyRepository,
        EventRepository $eventRepository,
        NotificationRepository $notificationRepository
    ) {
        $this->sponsorshipRepository = $sponsorshipRepository;
        $this->organizationRepository = $organizationRepository;
        $this->companyRepository = $companyRepository;
        $this->eventRepository = $eventRepository;
        $this->notificationRepository = $notificationRepository;
    }

    public function apply(int $userId, array $data): SponsorshipApplication
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            throw ValidationException::withMessages(['organization' => 'Profil organisasi tidak ditemukan.']);
        }

        $event = $this->eventRepository->findById($data['event_id']);
        if (!$event || $event->organization_id !== $org->id) {
            throw ValidationException::withMessages(['event_id' => 'Event tidak ditemukan atau bukan milik organisasi Anda.']);
        }

        if ($event->status !== 'active') {
            throw ValidationException::withMessages(['event_id' => 'Hanya event dengan status active yang dapat diajukan sponsorship.']);
        }

        $company = $this->companyRepository->findById($data['company_id']);
        if (!$company) {
            throw ValidationException::withMessages(['company_id' => 'Perusahaan tidak ditemukan.']);
        }

        // Check if already applied
        $existing = $this->sponsorshipRepository->findByEventAndCompany($event->id, $company->id);
        if ($existing) {
            throw ValidationException::withMessages(['company_id' => 'Event ini sudah diajukan ke perusahaan tersebut sebelumnya.']);
        }

        $coverLetterPath = $data['cover_letter'];
        if ($data['cover_letter'] instanceof \Illuminate\Http\UploadedFile) {
            $coverLetterPath = $data['cover_letter']->store('cover_letters', 'public');
        }

        $applicationData = [
            'event_id' => $event->id,
            'company_id' => $company->id,
            'organization_id' => $org->id,
            'support_type_requested' => $data['support_type_requested'],
            'cover_letter' => $coverLetterPath,
            'additional_message' => $data['additional_message'] ?? null,
            'status' => 'pending',
        ];

        $app = $this->sponsorshipRepository->create($applicationData);

        // Send notification to company user
        $this->notificationRepository->create([
            'user_id' => $company->user_id,
            'title' => 'Pengajuan Sponsorship Baru',
            'message' => "Organisasi {$org->name} mengajukan sponsorship untuk event '{$event->name}'.",
            'type' => 'sponsorship_received',
            'related_id' => $app->id,
            'related_type' => 'sponsorship_application',
            'is_read' => false,
        ]);

        return $app;
    }

    public function listApplications(int $userId, string $role, array $filters): CursorPaginator
    {
        if ($role === 'admin') {
            return $this->sponsorshipRepository->getAll($filters);
        }

        if ($role === 'organisasi') {
            $org = $this->organizationRepository->findByUserId($userId);
            $filters['organization_id'] = $org ? $org->id : 0;
            return $this->sponsorshipRepository->getAll($filters);
        }

        if ($role === 'perusahaan') {
            $company = $this->companyRepository->findByUserId($userId);
            $filters['company_id'] = $company ? $company->id : 0;
            return $this->sponsorshipRepository->getAll($filters);
        }

        throw ValidationException::withMessages(['role' => 'Role tidak dikenal.']);
    }

    public function getDetailAndReview(int $userId, string $role, int $id): ?SponsorshipApplication
    {
        $app = $this->sponsorshipRepository->findById($id);
        if (!$app) {
            return null;
        }

        // Authorization check
        if ($role === 'organisasi') {
            $org = $this->organizationRepository->findByUserId($userId);
            if (!$org || $app->organization_id !== $org->id) {
                return null;
            }
        } elseif ($role === 'perusahaan') {
            $company = $this->companyRepository->findByUserId($userId);
            if (!$company || $app->company_id !== $company->id) {
                return null;
            }

            // Auto-trigger reviewed logic
            if ($app->status === 'pending') {
                $this->sponsorshipRepository->update($app->id, [
                    'status' => 'reviewed',
                    'reviewed_at' => now(),
                ]);
                $app->refresh();

                // Send notification to organization user
                $this->notificationRepository->create([
                    'user_id' => $app->organization->user_id,
                    'title' => 'Pengajuan Sponsorship Ditinjau',
                    'message' => "Pengajuan sponsorship untuk event '{$app->event->name}' sedang ditinjau oleh {$company->name}.",
                    'type' => 'sponsorship_reviewed',
                    'related_id' => $app->id,
                    'related_type' => 'sponsorship_application',
                    'is_read' => false,
                ]);
            }
        }

        return $app;
    }

    public function decide(int $userId, int $id, string $status, ?string $responseMessage): SponsorshipApplication
    {
        $company = $this->companyRepository->findByUserId($userId);
        if (!$company) {
            throw ValidationException::withMessages(['company' => 'Profil perusahaan tidak ditemukan.']);
        }

        $app = $this->sponsorshipRepository->findById($id);
        if (!$app || $app->company_id !== $company->id) {
            throw ValidationException::withMessages(['sponsorship' => 'Pengajuan tidak ditemukan atau bukan milik perusahaan Anda.']);
        }

        if ($app->isFinal()) {
            throw ValidationException::withMessages(['status' => 'Keputusan sponsorship bersifat FINAL dan tidak dapat diubah lagi.']);
        }

        if (!in_array($status, ['accepted', 'rejected'])) {
            throw ValidationException::withMessages(['status' => 'Status keputusan tidak valid.']);
        }

        $this->sponsorshipRepository->update($app->id, [
            'status' => $status,
            'response_message' => $responseMessage,
            'decided_at' => now(),
        ]);
        $app->refresh();

        // Send notification to organization user
        $notifType = $status === 'accepted' ? 'sponsorship_accepted' : 'sponsorship_rejected';
        $statusLabel = $status === 'accepted' ? 'Diterima' : 'Ditolak';

        $this->notificationRepository->create([
            'user_id' => $app->organization->user_id,
            'title' => "Pengajuan Sponsorship {$statusLabel}",
            'message' => "Pengajuan sponsorship Anda untuk event '{$app->event->name}' telah {$statusLabel} oleh {$company->name}.",
            'type' => $notifType,
            'related_id' => $app->id,
            'related_type' => 'sponsorship_application',
            'is_read' => false,
        ]);

        return $app;
    }

    public function cancel(int $userId, int $id): SponsorshipApplication
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            throw ValidationException::withMessages(['organization' => 'Profil organisasi tidak ditemukan.']);
        }

        $app = $this->sponsorshipRepository->findById($id);
        if (!$app || $app->organization_id !== $org->id) {
            throw ValidationException::withMessages(['sponsorship' => 'Pengajuan tidak ditemukan atau bukan milik organisasi Anda.']);
        }

        if ($app->isFinal()) {
            throw ValidationException::withMessages(['status' => 'Pengajuan yang sudah diproses atau dibatalkan tidak dapat dibatalkan kembali.']);
        }

        // Only allow cancel if status is pending or reviewed
        if (!in_array($app->status, ['pending', 'reviewed'])) {
            throw ValidationException::withMessages(['status' => 'Hanya pengajuan dengan status pending atau reviewed yang dapat dibatalkan.']);
        }

        $this->sponsorshipRepository->update($app->id, [
            'status' => 'cancelled',
            'decided_at' => now(),
        ]);
        $app->refresh();

        // Send notification to company user
        $this->notificationRepository->create([
            'user_id' => $app->company->user_id,
            'title' => 'Pengajuan Sponsorship Dibatalkan',
            'message' => "Organisasi {$org->name} telah membatalkan pengajuan sponsorship untuk event '{$app->event->name}'.",
            'type' => 'sponsorship_cancelled',
            'related_id' => $app->id,
            'related_type' => 'sponsorship_application',
            'is_read' => false,
        ]);

        return $app;
    }
}
