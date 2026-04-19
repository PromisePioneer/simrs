<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bed_number' => ['required'],
            'room_id'    => ['required', 'exists:rooms,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'bed_number.required' => 'Nomor tempat tidur tidak boleh kosong.',
            'room_id.required'    => 'Ruangan tidak boleh kosong.',
            'room_id.exists'      => 'Ruangan tidak ditemukan.',
        ];
    }
}
