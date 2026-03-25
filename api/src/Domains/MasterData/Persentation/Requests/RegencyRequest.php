<?php

namespace Domains\MasterData\Persentation\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegencyRequest extends FormRequest
{
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
            'name' => ['required'],
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => 'Kolom ini harus diisi.',
        ];
    }
}
