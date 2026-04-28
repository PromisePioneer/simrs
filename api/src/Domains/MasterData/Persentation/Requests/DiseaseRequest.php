<?php

namespace Domains\MasterData\Persentation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DiseaseRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                 Rule::unique('diseases', 'code')->ignore($this->route('disease'))
            ],
            'name' => ['required', 'string'],
            'symptoms' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in('infectious', 'not_contagious')],
            'valid_code' => ['required', Rule::in('1', '0')],
            'accpdx' => ['required', 'string', Rule::in('Y', 'N')],
            'asterisk' => ['required', 'string', Rule::in('1', '0')],
            'im' => ['required', 'string', Rule::in('0', '1')],
        ];
    }


    public function messages(): array
    {
        return [];
    }
}
