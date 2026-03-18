<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'building_id'   => ['required', 'exists:buildings,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'name'          => ['required', Rule::unique('wards', 'name')->ignore($this->route('ward'))],
            'floor'         => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'building_id.required'   => 'Gedung tidak boleh kosong',
            'building_id.exists'     => 'Gedung tidak valid',
            'department_id.required' => 'Departemen tidak boleh kosong',
            'department_id.exists'   => 'Departemen tidak valid',
            'name.required'          => 'Nama tidak boleh kosong',
            'floor.required'         => 'Lantai tidak boleh kosong',
        ];
    }
}
