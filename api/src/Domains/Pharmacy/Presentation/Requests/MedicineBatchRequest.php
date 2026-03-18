<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicineBatchRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'medicine_id'   => ['required', 'exists:medicines,id'],
            'warehouse_id'  => ['required', 'exists:medicine_warehouses,id'],
            'rack_id'       => ['required', 'exists:medicine_racks,id'],
            'stock_amount'  => ['required', 'integer', 'min:0'],
            'expired_date'  => ['required', 'date', 'after:today'],
            'selling_price' => ['nullable', 'numeric', 'min:0'],
            'is_auto_batch' => ['required', 'boolean'],
            'batch_number'  => ['required_if:is_auto_batch,false', 'nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'medicine_id.required'  => 'Obat tidak boleh kosong.',
            'medicine_id.exists'    => 'Obat tidak ditemukan.',
            'warehouse_id.required' => 'Gudang tidak boleh kosong.',
            'warehouse_id.exists'   => 'Gudang tidak ditemukan.',
            'rack_id.required'      => 'Rak tidak boleh kosong.',
            'rack_id.exists'        => 'Rak tidak ditemukan.',
            'stock_amount.required' => 'Jumlah stok tidak boleh kosong.',
            'stock_amount.integer'  => 'Jumlah stok harus berupa angka.',
            'expired_date.required' => 'Tanggal kadaluarsa tidak boleh kosong.',
            'expired_date.after'    => 'Tanggal kadaluarsa harus lebih besar dari hari ini.',
        ];
    }
}
