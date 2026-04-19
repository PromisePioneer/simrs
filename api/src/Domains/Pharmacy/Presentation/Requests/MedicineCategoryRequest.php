<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicineCategoryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kategori tidak boleh kosong.',
        ];
    }
}
