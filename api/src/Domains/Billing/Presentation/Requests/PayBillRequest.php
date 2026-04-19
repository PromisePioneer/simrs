<?php

declare(strict_types=1);

namespace Domains\Billing\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayBillRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'payment_method_id' => ['required', 'uuid', 'exists:payment_methods,id'],
            'notes'             => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method_id.required' => 'Metode pembayaran harus dipilih.',
            'payment_method_id.exists'   => 'Metode pembayaran tidak ditemukan.',
        ];
    }
}
