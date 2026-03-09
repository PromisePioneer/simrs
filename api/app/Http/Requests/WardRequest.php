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
            'building_id' => ['required', 'exists:inpatient,id'],
            'department' => ['required'],
            'name' => ['required', Rule::unique('wards', 'name')->ignore($this->route('ward'))],
            'floor' => ['required'],
        ];
    }


    public function messages(): array
    {
        return [
            'building_id.required' => 'Gedung tidak boleh kosong',
            'department.required' => 'Departemen tidak boleh kosong',
            'name.required' => 'Nama tidak boleh kosong',
            'floor.required' => 'Lantai tidak boleh kosong',
        ];
    }
}
