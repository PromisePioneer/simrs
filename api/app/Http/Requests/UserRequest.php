<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {


        return [
            'name' => 'required',
            'email' => ['required',
                'email',
                Rule::unique('users', 'email')
                    ->ignore($this->route('user'))
            ],
            'phone' => ['required'],
            'address' => ['required'],
            'roles' => ['required', 'array'],
            'str_institution_id' => ['nullable'],
            'str_registration_number' => ['nullable'],
            'str_active_period' => [Rule::requiredIf(function () {
                return !empty($this->input('str_registration_number'));
            })],
            'sip_institution_id' => ['nullable'],
            'sip_registration_number' => ['nullable'],
            'sip_active_period' => [Rule::requiredIf(function () {
                return !empty($this->input('sip_registration_number'));
            })],
            'degrees' => ['nullable'],
            'degrees.*.id' => ['string', Rule::exists('degrees', 'id')],
            'signature' => ['nullable'],
            'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'doctor_schedule' => ['nullable', 'array'],
            'doctor_schedule.*.*.start_time' => ['date_format:H:i'],
            'doctor_schedule.*.*.end_time' => ['date_format:H:i', 'after:doctor_schedule.*.*.start'],
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => 'Nama tidak boleh kosong',
            'email.required' => 'Email tidak boleh kosong',
            'phone.required' => 'Telepon tidak boleh kosong',
            'address.required' => 'Alamat tidak boleh kosong',
            'roles.required' => 'role tidak boleh kosong',
            'roles.array' => 'role tidak boleh kosong',
            'str_active_period.required' => 'Tanggal Periode STR tidak boleh kosong',
            'sip_active_period.required' => 'Tanggal Periode SIP tidak boleh kosong',
            'degrees.*.id.exists' => 'Gelar tidak ditemukan',
            'profile_picture.image' => 'Gambar tidak valid',
            'doctor_schedule.*.start_time' => 'Jam mulai praktek harus berformat H:i',
            'doctor_schedule.*.end_time' => 'Jam berakhir harus berformat H:i',
            'doctor_schedule.*.*.end_time.after' => 'Jam berakhir prakter harus melebihi jam mulai praktek',

        ];
    }
}
