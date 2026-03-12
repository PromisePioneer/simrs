<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RoomRequest extends FormRequest
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'ward_id' => ['required', 'exists:wards,id'],
            'room_type_id' => ['required', 'exists:room_types,id'],
            'room_number' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
        ];
    }


    public function messages(): array
    {
        return [
            'room_type_id.required' => 'Tipe Ruangan tidak boleh kosong.',
            'room_type_id.exists' => 'Tipe Ruangan tidak ditemukan.',
            'room_number.required' => 'Nomor Ruangan tidak boleh kosong.',
            'room_number.max' => 'Nomor Ruangan tidak boleh lebih dari :max.',
            'name.required' => 'Nama Ruangan tidak boleh kosong.',
            'name.max' => 'Nama Ruangan tidak boleh lebih dari :max.',
            'capacity.required' => 'Kapasitas Ruangan tidak boleh kosong.',
            'capacity.integer' => 'Kapasitas Ruangan harus berupa angka.',
            'capacity.min' => 'Kapasitas Ruangan harus minimal 1.',
        ];
    }
}
