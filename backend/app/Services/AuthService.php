<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Repositories\OrganizationRepository;
use App\Repositories\CompanyRepository;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    protected UserRepository $userRepository;
    protected OrganizationRepository $organizationRepository;
    protected CompanyRepository $companyRepository;

    public function __construct(
        UserRepository $userRepository,
        OrganizationRepository $organizationRepository,
        CompanyRepository $companyRepository
    ) {
        $this->userRepository = $userRepository;
        $this->organizationRepository = $organizationRepository;
        $this->companyRepository = $companyRepository;
    }

    public function register(array $data): array
    {
        $userData = [
            'email' => $data['email'],
            'password' => $data['password'], // hashed by User model casts
            'role' => $data['role'],
            'is_active' => true,
            'is_verified' => false,
        ];

        $user = $this->userRepository->create($userData);

        // Auto-create blank profiles based on role
        if ($user->role === 'organisasi') {
            $name = explode('@', $user->email)[0] . ' Organization';
            $this->organizationRepository->create([
                'user_id' => $user->id,
                'name' => ucwords($name),
                'email' => $user->email,
            ]);
        } elseif ($user->role === 'perusahaan') {
            $name = 'PT ' . explode('@', $user->email)[0];
            $this->companyRepository->create([
                'user_id' => $user->id,
                'name' => ucwords($name),
                'email' => $user->email,
            ]);
        }

        $token = JWTAuth::fromUser($user);

        return [
            'token' => $token,
            'user' => $user,
        ];
    }

    public function login(array $credentials): ?array
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        if (!$user->is_active) {
            return ['banned' => true];
        }

        $token = JWTAuth::fromUser($user);

        return [
            'token' => $token,
            'user' => $user,
        ];
    }

    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }

    public function me(): ?User
    {
        return auth()->user();
    }
}
