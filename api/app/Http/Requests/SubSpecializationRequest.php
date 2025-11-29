<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubSpecializationRequest extends FormRequest
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
            'name' => ['required'],
            'specialization_id' => ['required', Rule::exists('specializations', 'id')],
        ];
    }


    public function messages(): array
    {
        return [
            'specialization_id.required' => 'Sub Spesialisasi tidak boleh kosong',
            'specialization_id.exists' => 'Spesialisasi tidak ditemukan',
        ];
    }
}
