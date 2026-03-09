<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AccountRequest extends FormRequest
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
            'account_category_id' => ['required', 'exists:account_categories,id'],
            'code' => ['required', 'string'],
            'name' => ['required', 'string'],
            'parent_id' => ['nullable', 'exists:accounts,id'],
        ];
    }


    public function messages(): array
    {
        return [
            'account_category_id.required' => 'Kategori akun tidak boleh kosong.',
            'account_category_id.exists' => 'Kategori akun tidak valid.',
            'code.required' => 'Kode akun tidak boleh kosong.',
            'parent_id.exists' => 'Parent akun tidak valid.',
        ];
    }
}
