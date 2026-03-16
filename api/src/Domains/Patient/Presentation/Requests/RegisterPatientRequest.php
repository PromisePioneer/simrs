<?php

declare(strict_types=1);

namespace Domains\Patient\Presentation\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Form Request: Validasi HTTP untuk registrasi pasien.
 *
 * Tanggung jawabnya HANYA validasi input HTTP.
 * Business rule (cek duplikat NIK) tetap di Handler/Domain.
 */
class RegisterPatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array|string> */
    public function rules(): array
    {
        return [
            'full_name'            => ['required', 'string', 'min:2'],
            'city_of_birth'        => ['required', 'string'],
            'date_of_birth'        => ['required', 'date', 'date_format:Y-m-d'],
            'id_card_number'       => ['required', 'string'],
            'gender'               => ['required', Rule::in(['pria', 'wanita'])],
            'religion'             => ['nullable', 'string'],
            'blood_type'           => ['nullable', 'string'],
            'job'                  => ['required', 'string'],
            'phone'                => ['required', 'string'],
            'email'                => ['nullable', 'email'],
            'date_of_consultation' => ['nullable', 'date', 'date_format:Y-m-d'],
            'kis_number'           => ['nullable', 'string'],
            'profile_picture'      => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],

            'addresses'                        => ['required', 'array', 'min:1'],
            'addresses.*.address'              => ['required', 'string'],
            'addresses.*.province'             => ['required', 'string'],
            'addresses.*.city'                 => ['required', 'string'],
            'addresses.*.subdistrict'          => ['required', 'string'],
            'addresses.*.ward'                 => ['required', 'string'],
            'addresses.*.postal_code'          => ['required', 'string'],

            'payment_methods'                           => ['required', 'array', 'min:1'],
            'payment_methods.*.payment_method_type_id'  => ['required', 'string', 'exists:payment_method_types,id'],
            'payment_methods.*.bpjs_number'             => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required'               => 'Nama lengkap wajib diisi.',
            'full_name.min'                    => 'Nama lengkap minimal 2 karakter.',
            'city_of_birth.required'           => 'Tempat lahir wajib diisi.',
            'date_of_birth.required'           => 'Tanggal lahir wajib diisi.',
            'date_of_birth.date_format'        => 'Format tanggal lahir tidak valid. Format: YYYY-MM-DD.',
            'id_card_number.required'          => 'NIK wajib diisi.',
            'gender.required'                  => 'Jenis kelamin wajib diisi.',
            'gender.in'                        => 'Jenis kelamin tidak valid.',
            'job.required'                     => 'Pekerjaan wajib diisi.',
            'phone.required'                   => 'Nomor telepon wajib diisi.',
            'profile_picture.mimes'            => 'Format gambar tidak valid. Format didukung: jpeg, png, jpg.',
            'profile_picture.max'              => 'Ukuran gambar maksimal 2MB.',
            'addresses.required'               => 'Minimal satu alamat wajib diisi.',
            'addresses.*.address.required'     => 'Alamat wajib diisi.',
            'addresses.*.province.required'    => 'Provinsi wajib diisi.',
            'addresses.*.city.required'        => 'Kota wajib diisi.',
            'addresses.*.subdistrict.required' => 'Kecamatan wajib diisi.',
            'addresses.*.ward.required'        => 'Kelurahan wajib diisi.',
            'addresses.*.postal_code.required' => 'Kode pos wajib diisi.',
            'payment_methods.required'         => 'Minimal satu metode pembayaran wajib diisi.',
            'payment_methods.*.payment_method_type_id.required' => 'Tipe metode pembayaran wajib diisi.',
            'payment_methods.*.payment_method_type_id.exists'   => 'Tipe metode pembayaran tidak ditemukan.',
        ];
    }
}
