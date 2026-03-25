<?php

namespace Domains\MasterData\Persentation\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DistrictRequest extends FormRequest
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
            'regency_id' => ['required', 'exists:regencies,id'],
            'name' => ['required'],
        ];
    }


    public function messages(): array
    {
        return [
            'regency_id.required' => 'Kolom ini harus diisi.',
            'regency_id.exists' => 'Kolom ini tidak valid.',
            'name.required' => 'Kolom ini harus diisi.',
        ];
    }
}
