<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'target_audience',
        'participant_count',
        'province',
        'city',
        'event_date',
        'category',
        'support_types_needed',
        'budget_range',
        'proposal_path',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'support_types_needed' => 'array',
            'event_date' => 'date',
            'participant_count' => 'integer',
        ];
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function sponsorshipApplications()
    {
        return $this->hasMany(SponsorshipApplication::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOwnedByOrganization($query, int $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    public function scopePublicVisible($query)
    {
        return $query->whereNotIn('status', ['hidden', 'removed']);
    }

    public function hasActiveSponsorships(): bool
    {
        return $this->sponsorshipApplications()
            ->whereIn('status', ['pending', 'reviewed', 'accepted'])
            ->exists();
    }
}
