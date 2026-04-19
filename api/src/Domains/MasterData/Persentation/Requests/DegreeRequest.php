<?php

declare(strict_types=1);

namespace Domains\MasterData\Persentation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DegreeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', Rule::in(['prefix', 'suffix'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama gelar wajib diisi.',
            'type.required' => 'Tipe gelar wajib diisi.',
            'type.in'       => 'Tipe gelar tidak valid. Pilihan: prefix, suffix.',
        ];
    }
}
