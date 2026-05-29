<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'category',
        'province',
        'city',
        'address',
        'logo_path',
        'email',
        'phone',
        'instagram',
        'linkedin',
        'website',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
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
            && !empty($this->description)
            && !empty($this->category)
            && !empty($this->province)
            && !empty($this->city)
            && !empty($this->address)
            && !empty($this->email)
            && !empty($this->phone);
    }
}
