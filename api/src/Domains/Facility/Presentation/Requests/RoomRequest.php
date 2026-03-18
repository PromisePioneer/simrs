<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ward_id'      => ['required', 'exists:wards,id'],
            'room_type_id' => ['required', 'exists:room_types,id'],
            'room_number'  => ['required', 'string', 'max:255'],
            'name'         => ['required', 'string', 'max:255'],
            'capacity'     => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'room_type_id.required' => 'Tipe Ruangan tidak boleh kosong.',
            'room_type_id.exists'   => 'Tipe Ruangan tidak ditemukan.',
            'room_number.required'  => 'Nomor Ruangan tidak boleh kosong.',
            'name.required'         => 'Nama Ruangan tidak boleh kosong.',
            'capacity.integer'      => 'Kapasitas Ruangan harus berupa angka.',
            'capacity.min'          => 'Kapasitas Ruangan harus minimal 1.',
        ];
    }
}
