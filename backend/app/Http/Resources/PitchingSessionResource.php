<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PitchingSessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sponsorship_application_id' => $this->sponsorship_application_id,
            'sponsorship_application' => new SponsorshipApplicationResource($this->whenLoaded('sponsorshipApplication')),
            'type' => $this->type,
            'meet_link' => $this->meet_link,
            'location' => $this->location,
            'scheduled_at' => $this->scheduled_at ? $this->scheduled_at->toIso8601String() : null,
            'notes' => $this->notes,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
