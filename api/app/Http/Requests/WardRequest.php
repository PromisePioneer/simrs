<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'building_id' => ['required', 'exists:buildings,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'name' => ['required', Rule::unique('wards', 'name')->ignore($this->route('ward'))],
            'floor' => ['required'],
        ];
    }


    public function messages(): array
    {
        return [
            'building_id.required' => 'Gedung tidak boleh kosong',
            'building_id.exists' => 'Gedung tidak valid',
            'department_id.required' => 'Departemen tidak boleh kosong',
            'department_id.exists' => 'Departemen tidak valid',
            'name.required' => 'Nama tidak boleh kosong',
            'floor.required' => 'Lantai tidak boleh kosong',
        ];
    }
}
