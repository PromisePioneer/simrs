<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PermissionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'      => ['required', 'string'],
            'module_id' => ['nullable', 'exists:modules,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama tidak boleh kosong.',
            'module_id.exists' => 'Modul tidak ditemukan.',
        ];
    }
}
