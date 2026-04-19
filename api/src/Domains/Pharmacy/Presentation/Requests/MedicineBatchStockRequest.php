<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicineBatchStockRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'batch_id'     => ['required', 'exists:medicine_batches,id'],
            'warehouse_id' => ['required', 'exists:medicine_warehouses,id'],
            'rack_id'      => ['required', 'exists:medicine_racks,id'],
            'stock_amount' => ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'batch_id.required'     => 'Batch tidak boleh kosong.',
            'batch_id.exists'       => 'Batch tidak ditemukan.',
            'warehouse_id.required' => 'Gudang tidak boleh kosong.',
            'warehouse_id.exists'   => 'Gudang tidak ditemukan.',
            'rack_id.required'      => 'Rak tidak boleh kosong.',
            'rack_id.exists'        => 'Rak tidak ditemukan.',
            'stock_amount.required' => 'Jumlah stok tidak boleh kosong.',
            'stock_amount.integer'  => 'Jumlah stok harus berupa angka.',
            'stock_amount.min'      => 'Jumlah stok tidak boleh negatif.',
        ];
    }
}
