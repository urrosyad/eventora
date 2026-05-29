<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\SponsorshipController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PitchingSessionController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    // Public Auth endpoints
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public Location endpoints
    Route::get('/location/provinces', [LocationController::class, 'provinces']);
    Route::get('/location/cities/{province_id}', [LocationController::class, 'cities']);

    // Protected endpoints
    Route::group(['middleware' => ['auth:api', 'active']], function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Organizations
        Route::group(['middleware' => 'role:admin'], function () {
            Route::get('/organizations', [OrganizationController::class, 'index']);
        });
        Route::group(['middleware' => 'role:admin,organisasi'], function () {
            Route::get('/organizations/{id}', [OrganizationController::class, 'show']);
        });
        Route::group(['middleware' => 'role:organisasi'], function () {
            Route::put('/organizations/{id}', [OrganizationController::class, 'update']);
            Route::get('/organizations/{id}/stats', [OrganizationController::class, 'stats']);
        });

        // Companies
        Route::group(['middleware' => 'role:admin,organisasi'], function () {
            Route::get('/companies', [CompanyController::class, 'index']);
            Route::get('/companies/{id}', [CompanyController::class, 'show']);
        });
        Route::group(['middleware' => 'role:perusahaan'], function () {
            Route::put('/companies/{id}', [CompanyController::class, 'update']);
            Route::get('/companies/{id}/stats', [CompanyController::class, 'stats']);
        });

        // Events
        Route::group(['middleware' => 'role:admin,organisasi'], function () {
            Route::get('/events', [EventController::class, 'index']);
        });
        Route::group(['middleware' => 'role:organisasi'], function () {
            Route::post('/events', [EventController::class, 'store']);
            Route::put('/events/{id}', [EventController::class, 'update']);
            Route::delete('/events/{id}', [EventController::class, 'destroy']);
            Route::put('/events/{id}/status', [EventController::class, 'updateStatus']);
            Route::post('/events/{id}/proposal', [EventController::class, 'uploadProposal']);
        });
        Route::group(['middleware' => 'role:admin,organisasi,perusahaan'], function () {
            Route::get('/events/{id}', [EventController::class, 'show']);
        });

        // Sponsorship Applications
        Route::group(['middleware' => 'role:organisasi'], function () {
            Route::post('/sponsorships', [SponsorshipController::class, 'store']);
            Route::put('/sponsorships/{id}/cancel', [SponsorshipController::class, 'cancel']);
        });
        Route::group(['middleware' => 'role:admin,organisasi,perusahaan'], function () {
            Route::get('/sponsorships', [SponsorshipController::class, 'index']);
            Route::get('/sponsorships/{id}', [SponsorshipController::class, 'show']);
        });
        Route::group(['middleware' => 'role:perusahaan'], function () {
            Route::put('/sponsorships/{id}/decide', [SponsorshipController::class, 'decide']);
        });

        // Bookmarks
        Route::group(['middleware' => 'role:organisasi'], function () {
            Route::get('/bookmarks', [BookmarkController::class, 'index']);
            Route::post('/bookmarks', [BookmarkController::class, 'store']);
            Route::delete('/bookmarks/{id}', [BookmarkController::class, 'destroy']);
        });

        // Notifications
        Route::group(['middleware' => 'role:organisasi,perusahaan'], function () {
            Route::get('/notifications', [NotificationController::class, 'index']);
            Route::put('/notifications/{id}/read', [NotificationController::class, 'read']);
            Route::put('/notifications/read-all', [NotificationController::class, 'readAll']);
        });

        // Pitching Sessions
        Route::group(['middleware' => 'role:organisasi'], function () {
            Route::post('/pitching', [PitchingSessionController::class, 'store']);
            Route::put('/pitching/{id}', [PitchingSessionController::class, 'update']);
        });
        Route::group(['middleware' => 'role:organisasi,perusahaan'], function () {
            Route::get('/pitching/{id}', [PitchingSessionController::class, 'show']);
        });

        // Admin panel endpoints
        Route::group(['prefix' => 'admin', 'middleware' => 'role:admin'], function () {
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/users', [AdminController::class, 'users']);
            Route::put('/users/{id}/ban', [AdminController::class, 'ban']);
            Route::delete('/users/{id}', [AdminController::class, 'destroy']);
            Route::put('/events/{id}/moderate', [AdminController::class, 'moderateEvent']);
            Route::get('/sponsorships', [AdminController::class, 'sponsorships']);
            Route::get('/reports/export', [AdminController::class, 'export']);
        });
    });
});
