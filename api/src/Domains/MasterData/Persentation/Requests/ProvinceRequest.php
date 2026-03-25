<?php

namespace Domains\MasterData\Persentation\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProvinceRequest extends FormRequest
{
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
            'province_id' => ['required', 'integer', 'exists:provinces,id'],
            'name' => ['required'],
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => 'Kolom ini harus diisi.',
            'province_id.required' => 'Kolom ini harus diisi.',
            'province_id.integer' => 'Kolom ini harus berupa integer.',
            'province_id.exists' => 'Kolom ini tidak valid.',
        ];
    }
}
