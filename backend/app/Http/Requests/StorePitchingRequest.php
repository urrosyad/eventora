<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePitchingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sponsorship_application_id' => ['required', 'exists:sponsorship_applications,id'],
            'type' => ['required', Rule::in(['online', 'offline'])],
            'meet_link' => ['required_if:type,online', 'nullable', 'url', 'max:255'],
            'location' => ['required_if:type,offline', 'nullable', 'string'],
            'scheduled_at' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
