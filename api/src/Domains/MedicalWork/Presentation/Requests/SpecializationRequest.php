<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SpecializationRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'profession_id' => ['required', 'uuid', 'exists:professions,id'],
            'name'          => ['required', 'string'],
            'description'   => ['nullable', 'string'],
        ];
    }
}
