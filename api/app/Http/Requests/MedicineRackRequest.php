<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MedicineRackRequest extends FormRequest
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
            'code' => ['required',
                Rule::unique('medicine_racks', 'code')
                    ->ignore($this->route('medicineRack'))
            ],
            'name' => ['required'],
        ];
    }


    public function messages(): array
    {
        return [
            'code.required' => 'Kode rak tidak boleh kosong',
            'name.required' => 'Nama rak tidak boleh kosong',
        ];
    }
}
