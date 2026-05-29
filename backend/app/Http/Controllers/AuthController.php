<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    use ApiResponse;

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return $this->success([
            'token' => $result['token'],
            'user' => new UserResource($result['user']),
        ], 'Registrasi berhasil', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        if (!$result) {
            return $this->error('Email atau password salah', 401);
        }

        if (isset($result['banned']) && $result['banned']) {
            return $this->error('Akun Anda ditangguhkan/diban oleh admin.', 401);
        }

        return $this->success([
            'token' => $result['token'],
            'user' => new UserResource($result['user']),
        ], 'Login berhasil');
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();
        return $this->success(null, 'Logout berhasil');
    }

    public function me(): JsonResponse
    {
        $user = $this->authService->me();
        if (!$user) {
            return $this->error('Unauthorized', 401);
        }
        return $this->success(new UserResource($user->load(['organization', 'company'])));
    }
}
