<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:200'],
            'description' => ['sometimes', 'required', 'string'],
            'target_audience' => ['sometimes', 'required', 'string', 'max:200'],
            'participant_count' => ['sometimes', 'required', 'integer', 'min:1', 'max:1000000'],
            'province' => ['sometimes', 'required', 'string', 'max:100'],
            'city' => ['sometimes', 'required', 'string', 'max:100'],
            'event_date' => ['sometimes', 'required', 'date'],
            'category' => ['sometimes', 'required', 'string', 'max:100'],
            'support_types_needed' => ['sometimes', 'required', 'array', 'min:1'],
            'support_types_needed.*' => ['string', 'max:100'],
            'budget_range' => ['sometimes', 'required', 'string', 'max:50'],
        ];
    }
}
