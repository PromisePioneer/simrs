<?php

declare(strict_types=1);

namespace Domains\Inpatient\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InpatientDailyCareRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'notes'       => ['required', 'string', 'max:2000'],
            'recorded_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'notes.required' => 'Catatan perawatan wajib diisi.',
            'notes.max'      => 'Catatan maksimal 2000 karakter.',
        ];
    }
}
