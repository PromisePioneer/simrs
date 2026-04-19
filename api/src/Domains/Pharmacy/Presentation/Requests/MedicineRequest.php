<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Requests;

use App\Enum\Medicine\MedicineType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MedicineRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'                     => ['required', 'string'],
            'type'                     => ['required', Rule::in(MedicineType::cases())],
            'base_unit'                => ['required', 'string'],
            'category_id'              => ['required', Rule::exists('medicine_categories', 'id')],
            'minimum_stock_amount'     => ['nullable', 'integer', 'min:0'],
            'expired_date'             => ['nullable', 'date', 'after:today'],
            'is_for_sell'              => ['boolean'],
            'must_has_receipt'         => ['boolean'],
            'reference_purchase_price' => ['nullable', 'numeric', 'min:0'],
            'units'                    => ['nullable'],
            'stock_base_unit'          => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'         => 'Nama tidak boleh kosong',
            'type.required'         => 'Jenis tidak boleh kosong',
            'base_unit.required'    => 'Satuan tidak boleh kosong',
            'category_id.required'  => 'Kategori tidak boleh kosong',
            'category_id.exists'    => 'Kategori tidak valid',
        ];
    }
}
