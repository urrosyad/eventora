<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SponsorshipApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'event' => new EventResource($this->whenLoaded('event')),
            'company_id' => $this->company_id,
            'company' => new CompanyResource($this->whenLoaded('company')),
            'organization_id' => $this->organization_id,
            'organization' => new OrganizationResource($this->whenLoaded('organization')),
            'support_type_requested' => $this->support_type_requested,
            'cover_letter' => (function() {
                $val = $this->cover_letter;
                if (!$val) return null;
                if (filter_var($val, FILTER_VALIDATE_URL)) {
                    return $val;
                }
                // Check if it is a file path (contains no spaces, contains a slash or ends with a common file extension)
                if (strpos($val, ' ') === false && (strpos($val, '/') !== false || preg_match('/\.(pdf|png|jpg|jpeg)$/i', $val))) {
                    return asset('storage/' . $val);
                }
                return $val;
            })(),
            'additional_message' => $this->additional_message,
            'response_message' => $this->response_message,
            'status' => $this->status,
            'reviewed_at' => $this->reviewed_at ? $this->reviewed_at->toIso8601String() : null,
            'decided_at' => $this->decided_at ? $this->decided_at->toIso8601String() : null,
            'pitching_session' => new PitchingSessionResource($this->whenLoaded('pitchingSession')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
