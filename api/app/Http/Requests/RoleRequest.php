<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
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
            'name' => [
                'required', 'string',
                Rule::unique('roles', 'name')->ignore($this->route('role'))
            ],
            'permissions' => ['nullable', 'array'],
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => 'Nama  tidak boleh kosong',
            'name.string' => 'Nama tidak valid',
            'name.unique' => 'Nama sudah terdaftar .',
        ];
    }
}
