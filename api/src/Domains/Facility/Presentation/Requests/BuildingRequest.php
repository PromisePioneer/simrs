<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BuildingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', Rule::unique('buildings', 'name')->ignore($this->route('building'))],
            'description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama gedung tidak boleh kosong',
        ];
    }
}
