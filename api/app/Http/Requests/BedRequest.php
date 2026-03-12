<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BedRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bed_number' => ['required'],
            'room_id' => ['required', 'exists:rooms,id'],
        ];
    }


    public function messages(): array
    {
        return [
            'bed_number.required' => 'Nomor tempat tidur tidak boleh kosong.',
            'room_id.required' => 'ruangan tidak boleh kosong.',
            'room_id.exists' => 'ruangan tidak ditemukan.',
        ];
    }
}
