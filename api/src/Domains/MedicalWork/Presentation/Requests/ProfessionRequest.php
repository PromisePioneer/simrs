<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfessionRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ];
    }
}
