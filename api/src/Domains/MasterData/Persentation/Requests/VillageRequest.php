<?php

namespace Domains\MasterData\Persentation\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class VillageRequest extends FormRequest
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
            'district_id' => ['required', 'exists:districts,id'],
            'name' => ['required'],
        ];
    }


    public function messages(): array
    {
        return [
            'district_id.required' => 'Kolom ini tidak boleh kosong',
            'district_id.exists' => 'Kolom ini tidak valid',
            'name.required' => 'Kolom ini harus diisi.',
        ];
    }
}
