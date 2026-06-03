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
            'cover_letter' => ['required', 'file', 'mimes:pdf,jpeg,png,jpg', 'max:10240'],
            'additional_message' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'cover_letter.required' => 'Surat pengantar wajib diunggah.',
            'cover_letter.file' => 'Surat pengantar harus berupa file.',
            'cover_letter.mimes' => 'Surat pengantar harus berformat PDF atau Gambar (JPEG, PNG).',
            'cover_letter.max' => 'Ukuran surat pengantar maksimal 10MB.',
        ];
    }
}
