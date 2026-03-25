<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentMethodTypeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                Rule::unique('payment_method_types', 'name')
                    ->ignore($this->route('paymentMethodType')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama tidak boleh kosong.',
            'name.unique'   => 'Nama sudah terdaftar.',
        ];
    }
}
