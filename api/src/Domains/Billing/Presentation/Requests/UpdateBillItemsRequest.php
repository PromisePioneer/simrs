<?php

declare(strict_types=1);

namespace Domains\Billing\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBillItemsRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'items'                       => ['required', 'array', 'min:1'],
            'items.*.item_type'           => ['required', 'in:consultation,medicine,room,procedure,other'],
            'items.*.description'         => ['required', 'string', 'max:255'],
            'items.*.quantity'            => ['required', 'integer', 'min:1'],
            'items.*.unit_price'          => ['required', 'numeric', 'min:0'],
            'items.*.medicine_batch_id'   => ['nullable', 'uuid', 'exists:medicine_batches,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'                    => 'Minimal satu item harus ada.',
            'items.*.item_type.in'              => 'Tipe item tidak valid.',
            'items.*.description.required'      => 'Deskripsi item harus diisi.',
            'items.*.quantity.min'              => 'Jumlah minimal 1.',
            'items.*.unit_price.min'            => 'Harga satuan tidak boleh negatif.',
        ];
    }
}
