<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PharmacyPurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', 'pharmacy.po');
    }

    public function rules(): array
    {
        return [
            'supplier_id' => 'required|integer|exists:pharmacy_suppliers,id',
            'warehouse_id' => 'required|uuid|exists:medicine_warehouses,id',
            'expected_delivery_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|uuid|exists:medicines,id',
            'items.*.unit_id' => 'nullable|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'supplier_id.required' => 'Supplier harus dipilih',
            'supplier_id.exists' => 'Supplier tidak ditemukan',
            'warehouse_id.required' => 'Gudang harus dipilih',
            'expected_delivery_date.after' => 'Tanggal pengiriman harus di masa depan',
            'items.required' => 'Minimal ada 1 item obat',
            'items.*.quantity.min' => 'Quantity minimal 1',
            'items.*.unit_price.min' => 'Harga unit tidak boleh negatif',
        ];
    }
}
