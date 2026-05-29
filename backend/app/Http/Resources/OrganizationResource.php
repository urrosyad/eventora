<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->category,
            'province' => $this->province,
            'city' => $this->city,
            'address' => $this->address,
            'logo_url' => $this->logo_path ? asset('storage/' . $this->logo_path) : null,
            'email' => $this->email,
            'phone' => $this->phone,
            'instagram' => $this->instagram,
            'linkedin' => $this->linkedin,
            'website' => $this->website,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
