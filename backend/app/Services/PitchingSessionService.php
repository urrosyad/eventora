<?php

namespace App\Services;

use App\Repositories\PitchingSessionRepository;
use App\Repositories\SponsorshipApplicationRepository;
use App\Repositories\NotificationRepository;
use App\Repositories\OrganizationRepository;
use App\Models\PitchingSession;
use Illuminate\Validation\ValidationException;

class PitchingSessionService
{
    protected PitchingSessionRepository $pitchingRepository;
    protected SponsorshipApplicationRepository $sponsorshipRepository;
    protected NotificationRepository $notificationRepository;
    protected OrganizationRepository $organizationRepository;

    public function __construct(
        PitchingSessionRepository $pitchingRepository,
        SponsorshipApplicationRepository $sponsorshipRepository,
        NotificationRepository $notificationRepository,
        OrganizationRepository $organizationRepository
    ) {
        $this->pitchingRepository = $pitchingRepository;
        $this->sponsorshipRepository = $sponsorshipRepository;
        $this->notificationRepository = $notificationRepository;
        $this->organizationRepository = $organizationRepository;
    }

    public function schedulePitching(int $userId, array $data): PitchingSession
    {
        $org = $this->organizationRepository->findByUserId($userId);
        if (!$org) {
            throw ValidationException::withMessages(['organization' => 'Profil organisasi tidak ditemukan.']);
        }

        $app = $this->sponsorshipRepository->findById($data['sponsorship_application_id']);
        if (!$app || $app->organization_id !== $org->id) {
            throw ValidationException::withMessages(['sponsorship_application_id' => 'Pengajuan tidak ditemukan atau bukan milik organisasi Anda.']);
        }

        if ($app->status !== 'accepted') {
            throw ValidationException::withMessages(['sponsorship_application_id' => 'Sesi pitching hanya dapat dijadwalkan untuk pengajuan sponsorship yang DITERIMA (accepted).']);
        }

        // Check if pitching session already exists for this application
        if ($app->pitchingSession) {
            throw ValidationException::withMessages(['sponsorship_application_id' => 'Sesi pitching sudah dijadwalkan sebelumnya untuk pengajuan ini.']);
        }

        $sessionData = [
            'sponsorship_application_id' => $app->id,
            'type' => $data['type'],
            'meet_link' => $data['type'] === 'online' ? ($data['meet_link'] ?? null) : null,
            'location' => $data['type'] === 'offline' ? ($data['location'] ?? null) : null,
            'scheduled_at' => $data['scheduled_at'],
            'notes' => $data['notes'] ?? null,
            'created_by' => $userId,
        ];

        // Conditional validation
        if ($data['type'] === 'online' && empty($data['meet_link'])) {
            throw ValidationException::withMessages(['meet_link' => 'Link Google Meet wajib diisi jika tipe meeting online.']);
        }
        if ($data['type'] === 'offline' && empty($data['location'])) {
            throw ValidationException::withMessages(['location' => 'Lokasi fisik wajib diisi jika tipe meeting offline.']);
        }

        $session = $this->pitchingRepository->create($sessionData);

        // Send notification to company user
        $dateFormatted = date('d M Y H:i', strtotime($session->scheduled_at));
        $this->notificationRepository->create([
            'user_id' => $app->company->user_id,
            'title' => 'Sesi Pitching Dijadwalkan',
            'message' => "Organisasi {$org->name} menjadwalkan sesi pitching untuk event '{$app->event->name}' pada {$dateFormatted}.",
            'type' => 'pitching_scheduled',
            'related_id' => $session->id,
            'related_type' => 'pitching_session',
            'is_read' => false,
        ]);

        return $session;
    }

    public function getDetail(int $userId, string $role, int $id): ?PitchingSession
    {
        $session = $this->pitchingRepository->findById($id);
        if (!$session) {
            return null;
        }

        // Authorization check: only owning organization and target company can view
        if ($role === 'organisasi') {
            $org = $this->organizationRepository->findByUserId($userId);
            if (!$org || $session->sponsorshipApplication->organization_id !== $org->id) {
                return null;
            }
        } elseif ($role === 'perusahaan') {
            $company = $this->companyRepository->findByUserId($userId);
            if (!$company || $session->sponsorshipApplication->company_id !== $company->id) {
                return null;
            }
        }

        return $session;
    }

    public function updateSession(int $userId, int $id, array $data): ?PitchingSession
    {
        $session = $this->pitchingRepository->findById($id);
        if (!$session || $session->created_by !== $userId) {
            return null;
        }

        // Check if types are updated and adjust conditional fields
        if (isset($data['type'])) {
            if ($data['type'] === 'online' && empty($data['meet_link'])) {
                throw ValidationException::withMessages(['meet_link' => 'Link Google Meet wajib diisi jika tipe meeting online.']);
            }
            if ($data['type'] === 'offline' && empty($data['location'])) {
                throw ValidationException::withMessages(['location' => 'Lokasi fisik wajib diisi jika tipe meeting offline.']);
            }

            if ($data['type'] === 'online') {
                $data['location'] = null;
            } else {
                $data['meet_link'] = null;
            }
        }

        $this->pitchingRepository->update($id, $data);

        // Send updated notification to company user
        $app = $session->sponsorshipApplication;
        $dateFormatted = date('d M Y H:i', strtotime($session->fresh()->scheduled_at));
        $this->notificationRepository->create([
            'user_id' => $app->company->user_id,
            'title' => 'Sesi Pitching Diperbarui',
            'message' => "Detail sesi pitching untuk event '{$app->event->name}' telah diperbarui menjadi {$dateFormatted}.",
            'type' => 'pitching_scheduled',
            'related_id' => $session->id,
            'related_type' => 'pitching_session',
            'is_read' => false,
        ]);

        return $session->fresh();
    }
}
