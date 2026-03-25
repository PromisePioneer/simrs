<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModuleRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string'],
            'parent_id'      => ['nullable', 'exists:modules,id'],
            'route'          => ['nullable', 'string'],
            'icon'           => ['nullable', 'string'],
            'order'          => ['nullable', 'integer'],
            'permissions'    => ['nullable', 'array'],
            'permissions.*'  => ['max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'        => 'Nama tidak boleh kosong.',
            'parent_id.exists'     => 'Parent ID tidak valid.',
            'permissions.*.exists' => 'Permission tidak valid.',
        ];
    }
}
