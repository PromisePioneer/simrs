<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubSpecializationRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'specialization_id' => ['required', 'uuid', 'exists:specializations,id'],
            'name'              => ['required', 'string'],
            'description'       => ['nullable', 'string'],
        ];
    }
}
