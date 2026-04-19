<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string'],
            'email'    => ['required', 'email', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8'],
            'phone'    => ['required', 'string'],
            'address'  => ['required', 'string'],
            'roles'    => ['required', 'array'],
            'roles.*'  => ['string', 'exists:roles,name'],

            'poli_id'                 => ['nullable', 'uuid', 'exists:poli,id'],
            'str_institution_id'      => ['nullable', 'uuid'],
            'str_registration_number' => ['nullable', 'string'],
            'str_active_period'       => [Rule::requiredIf(fn() => !empty($this->str_registration_number))],
            'sip_institution_id'      => ['nullable', 'uuid'],
            'sip_registration_number' => ['nullable', 'string'],
            'sip_active_period'       => [Rule::requiredIf(fn() => !empty($this->sip_registration_number))],

            'degrees'         => ['nullable', 'array'],
            'degrees.*.id'    => ['required', 'uuid', 'exists:degrees,id'],
            'degrees.*.order' => ['nullable', 'integer'],

            'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'signature'       => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],

            'doctor_schedule'               => ['nullable', 'array'],
            'doctor_schedule.*.day_of_week' => ['required', Rule::in(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'])],
            'doctor_schedule.*.start_time'  => ['required', 'date_format:H:i'],
            'doctor_schedule.*.end_time'    => ['required', 'date_format:H:i', 'after:doctor_schedule.*.start_time'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Nama tidak boleh kosong.',
            'email.required'    => 'Email tidak boleh kosong.',
            'email.unique'      => 'Email sudah terdaftar.',
            'password.required' => 'Password tidak boleh kosong.',
            'password.min'      => 'Password minimal 8 karakter.',
            'phone.required'    => 'Nomor telepon tidak boleh kosong.',
            'address.required'  => 'Alamat tidak boleh kosong.',
            'roles.required'    => 'Role wajib dipilih minimal satu.',
            'str_active_period.required' => 'Periode STR wajib diisi jika nomor STR diisi.',
            'sip_active_period.required' => 'Periode SIP wajib diisi jika nomor SIP diisi.',
            'degrees.*.id.exists' => 'Gelar tidak ditemukan.',
        ];
    }
}
