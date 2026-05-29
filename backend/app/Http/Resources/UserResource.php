<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'is_verified' => $this->is_verified,
            'organization' => $this->when($this->role === 'organisasi' && $this->relationLoaded('organization'),
                fn() => $this->organization ? new OrganizationResource($this->organization) : null
            ),
            'company' => $this->when($this->role === 'perusahaan' && $this->relationLoaded('company'),
                fn() => $this->company ? new CompanyResource($this->company) : null
            ),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
