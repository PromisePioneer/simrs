<?php

namespace Domains\IAM\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'default_capacity' => ['required', 'integer', 'min:1'],
        ];
    }


    public function messages(): array
    {
        return [
            'code.required' => 'Kode tidak boleh kosong.',
            'code.max' => 'Kode tidak boleh lebih dari 255 karakter.',
            'name.required' => 'Nama tidak boleh kosong.',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'description.required' => 'Deskripsi tidak boleh kosong.',
            'default_capacity.required' => 'Kapasitas tidak boleh kosong.',
            'default_capacity.integer' => 'Kapasitas harus integer.',
            'default_capacity.min' => 'Kapasitas harus minimal 1.',
        ];
    }
}
