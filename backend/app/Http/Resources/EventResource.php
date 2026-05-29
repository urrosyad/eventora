<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'organization' => new OrganizationResource($this->whenLoaded('organization')),
            'name' => $this->name,
            'description' => $this->description,
            'target_audience' => $this->target_audience,
            'participant_count' => $this->participant_count,
            'province' => $this->province,
            'city' => $this->city,
            'event_date' => $this->event_date ? $this->event_date->format('Y-m-d') : null,
            'category' => $this->category,
            'support_types_needed' => $this->support_types_needed ?? [],
            'budget_range' => $this->budget_range,
            'proposal_url' => $this->proposal_path ? asset('storage/' . $this->proposal_path) : null,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
