<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class MedicineWarehouseRequest extends FormRequest
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
            'code' => ['required'],
            'name' => ['required'],
            'racks' => ['required', 'array'],
            'racks.*' => ['required', 'string'],
        ];
    }


    public function messages(): array
    {
        return [
            'code.required' => 'Kode tidak boleh kosong',
            'name.required' => 'Nama tidak boleh kosong',
        ];
    }
}
