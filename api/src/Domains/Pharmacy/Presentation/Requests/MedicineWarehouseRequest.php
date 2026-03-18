<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MedicineWarehouseRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', Rule::unique('medicine_warehouses', 'code')->ignore($this->route('medicineWarehouse'))],
            'name' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required'   => 'Kode gudang tidak boleh kosong.',
            'code.unique'     => 'Kode gudang sudah digunakan.',
            'name.required'   => 'Nama gudang tidak boleh kosong.',
        ];
    }
}
