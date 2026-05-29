<?php

namespace App\Services;

use App\Repositories\OrganizationRepository;
use App\Repositories\UserRepository;
use App\Models\Organization;
use App\Models\SponsorshipApplication;
use Illuminate\Support\Facades\Storage;

class OrganizationService
{
    protected OrganizationRepository $organizationRepository;
    protected UserRepository $userRepository;

    public function __construct(
        OrganizationRepository $organizationRepository,
        UserRepository $userRepository
    ) {
        $this->organizationRepository = $organizationRepository;
        $this->userRepository = $userRepository;
    }

    public function updateProfile(int $userId, array $data): ?Organization
    {
        $organization = $this->organizationRepository->findByUserId($userId);
        if (!$organization) {
            return null;
        }

        // Handle logo upload if provided
        if (isset($data['logo']) && $data['logo']->isValid()) {
            if ($organization->logo_path) {
                Storage::disk('public')->delete($organization->logo_path);
            }
            $path = $data['logo']->store('logos', 'public');
            $data['logo_path'] = $path;
            unset($data['logo']);
        }

        $this->organizationRepository->update($organization->id, $data);
        $organization->refresh();

        // Check if profile is complete and update user verification
        $isComplete = $organization->isProfileComplete();
        $this->userRepository->update($userId, ['is_verified' => $isComplete]);

        return $organization;
    }

    public function getStats(int $userId): array
    {
        $organization = $this->organizationRepository->findByUserId($userId);
        if (!$organization) {
            return [
                'accepted' => 0,
                'pending' => 0,
                'rejected' => 0,
                'cancelled' => 0,
            ];
        }

        return [
            'accepted' => SponsorshipApplication::where('organization_id', $organization->id)->where('status', 'accepted')->count(),
            'pending' => SponsorshipApplication::where('organization_id', $organization->id)->where('status', 'pending')->count(),
            'rejected' => SponsorshipApplication::where('organization_id', $organization->id)->where('status', 'rejected')->count(),
            'cancelled' => SponsorshipApplication::where('organization_id', $organization->id)->where('status', 'cancelled')->count(),
        ];
    }
}
