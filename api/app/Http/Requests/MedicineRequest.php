<?php

namespace App\Http\Requests;

use App\Enum\Medicine\MedicineType;
use App\Models\Medicine;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MedicineRequest extends FormRequest
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
            'sku' => ['required', 'string', Rule::unique(Medicine::class)->ignore($this->route('medicine'))],
            'code' => ['required', 'string'],
            'name' => ['required', 'string'],
            'type' => ['required', Rule::in(MedicineType::cases())],
            'base_unit' => ['required', 'string'],
            'category_id' => ['required', Rule::exists('medicine_categories', 'id')],

            // stok awal
            'warehouse_id' => ['required', Rule::exists('medicine_warehouses', 'id')],
            'rack_id' => ['nullable', Rule::exists('medicine_racks', 'id')],
            'stock_amount' => ['nullable', 'integer', 'min:0'],
            'expired_date' => ['nullable', 'date'],
            'is_for_sell' => 'boolean',
            'must_has_receipt' => 'boolean',
            'reference_purchase_price' => 'nullable|numeric|min:0',
        ];
    }


    public function messages(): array
    {
        return [
            'sku.required' => 'SKU tidak boleh kosong',
            'sku.unique' => 'SKU sudah terdaftar',
            'code.required' => 'Kode tidak boleh kosong',
            'name.required' => 'Nama tidak boleh kosong',
            'type.required' => 'Jenis tidak boleh kosong',
            'base_unit.required' => 'Satuan tidak boleh kosong',
            'category_id.required' => 'Kategori tidak boleh kosong',
            'category_id.exists' => 'Kategori tidak valid',
            'warehouse_id.required' => 'Gudang tidak boleh kosong',
            'rack_id.required' => 'Rak tidak boleh kosong',
            'warehouse_id.exists' => 'Gudang tidak valid',
            'rack_id.exists' => 'Rak tidak valid',
            'stock_amount.integer' => 'Stok harus berupa angka',
            'stock_amount.min' => 'Stok minimal 0',
            'reference_purchase_price.numeric' => 'Harga beli harus berupa angka',
            'reference_purchase_price.min' => 'Harga beli minimal 0',
            'reference_purchase_price.required' => 'Harga beli tidak boleh kosong',
            'expired_date.date' => 'Tanggal kadaluarsa tidak valid'
        ];
    }
}
