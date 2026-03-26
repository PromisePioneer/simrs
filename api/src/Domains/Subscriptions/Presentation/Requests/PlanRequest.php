<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Presentation\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'description'    => ['required', 'string'],
            'price'          => ['required', 'numeric', 'min:0'],
            'billing_period' => ['required', 'string', 'in:monthly,yearly,lifetime'],
            'max_users'      => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'           => 'Nama plan tidak boleh kosong.',
            'description.required'    => 'Deskripsi tidak boleh kosong.',
            'price.required'          => 'Harga tidak boleh kosong.',
            'price.numeric'           => 'Harga harus berupa angka.',
            'billing_period.required' => 'Periode billing tidak boleh kosong.',
            'billing_period.in'       => 'Periode billing harus monthly, yearly, atau lifetime.',
            'max_users.required'      => 'Maksimal user tidak boleh kosong.',
            'max_users.integer'       => 'Maksimal user harus berupa angka bulat.',
        ];
    }
}
