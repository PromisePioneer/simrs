<?php

declare(strict_types=1);

namespace Domains\Accounting\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccountRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'account_category_id' => ['required', 'uuid', 'exists:account_categories,id'],
            'code'                => ['required', 'string'],
            'name'                => ['required', 'string'],
            'parent_id'           => ['nullable', 'uuid', 'exists:accounts,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'account_category_id.required' => 'Kategori akun tidak boleh kosong.',
            'code.required'                => 'Kode akun tidak boleh kosong.',
            'name.required'                => 'Nama akun tidak boleh kosong.',
        ];
    }
}
