<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkDeleteUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'string', 'uuid'],
        ];
    }

    public function messages(): array
    {
        return [
            'ids.required'   => 'Daftar ID user wajib diisi.',
            'ids.array'      => 'Format ids harus berupa array.',
            'ids.min'        => 'Minimal satu ID user harus disertakan.',
            'ids.*.uuid'     => 'Setiap ID harus berupa UUID yang valid.',
        ];
    }
}
