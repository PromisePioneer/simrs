<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ModuleRequest extends FormRequest
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
            'name' => ['required', 'string'],
            'parent_id' => [
                'nullable',
                'exists:modules,id',
            ],
            'route' => ['nullable', 'string'],
            'icon' => ['nullable', 'string'],
            'order' => ['nullable', 'integer'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['max:255'],
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => 'Nama tidak boleh kosong.',
            'parent_id.exists' => 'Parent ID tidak valid.',
            'permissions.*.exists' => 'Permission tidak valid.',
            'permissions.*.required' => 'Permission tidak boleh kosong.',
            'permissions.*.array' => 'Permission tidak valid.',
        ];
    }
}
