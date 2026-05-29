<?php

namespace App\Repositories;

use App\Models\PitchingSession;

class PitchingSessionRepository
{
    public function create(array $data): PitchingSession
    {
        return PitchingSession::create($data);
    }

    public function findById(int $id): ?PitchingSession
    {
        return PitchingSession::with(['sponsorshipApplication.event', 'sponsorshipApplication.company', 'sponsorshipApplication.organization', 'creator'])->find($id);
    }

    public function update(int $id, array $data): bool
    {
        $session = PitchingSession::find($id);
        if (!$session) {
            return false;
        }
        return $session->update($data);
    }
}
