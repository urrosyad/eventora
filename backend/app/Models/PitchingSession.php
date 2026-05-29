<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PitchingSession extends Model
{
    protected $fillable = [
        'sponsorship_application_id',
        'type',
        'meet_link',
        'location',
        'scheduled_at',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
        ];
    }

    public function sponsorshipApplication()
    {
        return $this->belongsTo(SponsorshipApplication::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
