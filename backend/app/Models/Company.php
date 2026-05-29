<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'industry',
        'description',
        'province',
        'city',
        'address',
        'email',
        'phone',
        'website',
        'instagram',
        'linkedin',
        'logo_path',
        'sponsorship_preferences',
        'support_types_offered',
    ];

    protected function casts(): array
    {
        return [
            'sponsorship_preferences' => 'array',
            'support_types_offered' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sponsorshipApplications()
    {
        return $this->hasMany(SponsorshipApplication::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function isProfileComplete(): bool
    {
        return !empty($this->name)
            && !empty($this->industry)
            && !empty($this->description)
            && !empty($this->province)
            && !empty($this->city)
            && !empty($this->address)
            && !empty($this->email)
            && !empty($this->support_types_offered);
    }
}
