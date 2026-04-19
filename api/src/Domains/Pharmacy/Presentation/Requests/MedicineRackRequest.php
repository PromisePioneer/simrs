<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicineRackRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'warehouse_id' => ['required', 'exists:medicine_warehouses,id'],
            'code'         => ['required', 'string'],
            'name'         => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'warehouse_id.required' => 'Gudang tidak boleh kosong.',
            'warehouse_id.exists'   => 'Gudang tidak ditemukan.',
            'code.required'         => 'Kode rak tidak boleh kosong.',
            'name.required'         => 'Nama rak tidak boleh kosong.',
        ];
    }
}
