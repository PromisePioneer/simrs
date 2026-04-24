<?php

namespace Domains\MasterData\Persentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PoliRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'consultation_fee' => 'required|numeric',
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => 'Nama tidak boleh kosong',
            'consultation_fee.required' => 'Jumlah konsultasi tidak boleh kosong',
        ];
    }

}
