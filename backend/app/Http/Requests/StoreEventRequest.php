<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'target_audience' => ['required', 'string', 'max:200'],
            'participant_count' => ['required', 'integer', 'min:1', 'max:1000000'],
            'province' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'event_date' => ['required', 'date'],
            'category' => ['required', 'string', 'max:100'],
            'support_types_needed' => ['required', 'array', 'min:1'],
            'support_types_needed.*' => ['string', 'max:100'],
            'budget_range' => ['required', 'string', 'max:50'],
            'proposal' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ];
    }
}
