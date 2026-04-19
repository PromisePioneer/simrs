<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicineUnitTypeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string'],
            'name' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode tidak boleh kosong.',
            'name.required' => 'Nama tidak boleh kosong.',
        ];
    }
}
