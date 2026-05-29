<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'industry' => $this->industry,
            'description' => $this->description,
            'province' => $this->province,
            'city' => $this->city,
            'address' => $this->address,
            'email' => $this->email,
            'phone' => $this->phone,
            'website' => $this->website,
            'instagram' => $this->instagram,
            'linkedin' => $this->linkedin,
            'logo_url' => $this->logo_path ? asset('storage/' . $this->logo_path) : null,
            'sponsorship_preferences' => $this->sponsorship_preferences ?? [],
            'support_types_offered' => $this->support_types_offered ?? [],
            'is_verified' => $this->user ? $this->user->is_verified : false,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
