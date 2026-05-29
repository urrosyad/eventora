<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SponsorshipApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'company_id',
        'organization_id',
        'support_type_requested',
        'cover_letter',
        'additional_message',
        'response_message',
        'status',
        'reviewed_at',
        'decided_at',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
            'decided_at' => 'datetime',
        ];
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function pitchingSession()
    {
        return $this->hasOne(PitchingSession::class);
    }

    // Scopes
    public function scopeForOrganization($query, int $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopePendingOrReviewed($query)
    {
        return $query->whereIn('status', ['pending', 'reviewed']);
    }

    public function scopeFinal($query)
    {
        return $query->whereIn('status', ['accepted', 'rejected', 'cancelled']);
    }

    public function isFinal(): bool
    {
        return in_array($this->status, ['accepted', 'rejected', 'cancelled']);
    }
}
