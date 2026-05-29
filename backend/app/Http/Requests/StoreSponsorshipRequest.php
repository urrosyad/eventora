<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSponsorshipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => ['required', 'exists:events,id'],
            'company_id' => ['required', 'exists:companies,id'],
            'support_type_requested' => ['required', 'string', 'max:100'],
            'cover_letter' => ['required', 'string', 'min:50'],
            'additional_message' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'cover_letter.min' => 'Surat pengantar minimal 50 karakter.',
        ];
    }
}
