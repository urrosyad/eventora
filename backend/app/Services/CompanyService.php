<?php

namespace App\Services;

use App\Repositories\CompanyRepository;
use App\Repositories\UserRepository;
use App\Models\Company;
use App\Models\SponsorshipApplication;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Facades\Storage;

class CompanyService
{
    protected CompanyRepository $companyRepository;
    protected UserRepository $userRepository;

    public function __construct(
        CompanyRepository $companyRepository,
        UserRepository $userRepository
    ) {
        $this->companyRepository = $companyRepository;
        $this->userRepository = $userRepository;
    }

    public function updateProfile(int $userId, array $data): ?Company
    {
        $company = $this->companyRepository->findByUserId($userId);
        if (!$company) {
            return null;
        }

        // Handle logo upload if provided
        if (isset($data['logo']) && $data['logo']->isValid()) {
            if ($company->logo_path) {
                Storage::disk('public')->delete($company->logo_path);
            }
            $path = $data['logo']->store('logos', 'public');
            $data['logo_path'] = $path;
            unset($data['logo']);
        }

        // Keep preferences and support types as arrays, Laravel Model casts will encode to JSON
        $this->companyRepository->update($company->id, $data);
        $company->refresh();

        // Check if profile is complete and update user verification
        $isComplete = $company->isProfileComplete();
        $this->userRepository->update($userId, ['is_verified' => $isComplete]);

        return $company;
    }

    public function getStats(int $userId): array
    {
        $company = $this->companyRepository->findByUserId($userId);
        if (!$company) {
            return [
                'accepted' => 0,
                'pending' => 0,
                'rejected' => 0,
                'cancelled' => 0,
                'reviewed' => 0,
            ];
        }

        return [
            'accepted' => SponsorshipApplication::where('company_id', $company->id)->where('status', 'accepted')->count(),
            'pending' => SponsorshipApplication::where('company_id', $company->id)->where('status', 'pending')->count(),
            'rejected' => SponsorshipApplication::where('company_id', $company->id)->where('status', 'rejected')->count(),
            'cancelled' => SponsorshipApplication::where('company_id', $company->id)->where('status', 'cancelled')->count(),
            'reviewed' => SponsorshipApplication::where('company_id', $company->id)->where('status', 'reviewed')->count(),
        ];
    }

    public function listCompanies(array $filters): CursorPaginator
    {
        return $this->companyRepository->getAll($filters);
    }

    public function getCompanyDetail(int $id): ?Company
    {
        return $this->companyRepository->findById($id);
    }
}
