<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentMethodRequest extends FormRequest
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
            'payment_method_type_id' => ['required', 'string', Rule::exists('payment_method_types', 'id')],
            'name' => ['required', 'string', Rule::unique('payment_methods', 'name')->ignore($this->route('paymentMethod'))],
        ];
    }


    public function messages(): array
    {
        return [
            'payment_method_type_id.required' => 'Jenis metode pembayaran wajib diisi.',
            'name.required' => 'Nama metode pembayaran wajib diisi.',
            'name.unique' => 'Nama metode pembayaran sudah terdaftar.',
        ];
    }
}
