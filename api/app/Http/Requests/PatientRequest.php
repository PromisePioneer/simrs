<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PatientRequest extends FormRequest
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
            'full_name' => ['required'],
            'medical_record_number' => [
                'nullable',
                Rule::unique('patients', 'medical_record_number')->ignore($this->route('patient'))
            ],
            'city_of_birth' => ['required'],
            'date_of_birth' => ['required', 'date', 'date_format:Y-m-d'],
            'id_card_number' => [
                'required',
                Rule::unique('patients', 'id_card_number')->ignore($this->route('patient'))
            ],
            'gender' => ['required', Rule::in('pria', 'wanita')],
            'religion' => ['required'],
            'blood_type' => ['required'],
            'job' => ['required'],
            'phone' => ['required'],
            'email' => [
                'required',
                Rule::unique('patients', 'email')
                    ->ignore($this->route('patient'))
            ],
            'date_of_consultation' => ['nullable', 'date', 'date_format:Y-m-d'],
            'profile_picture' => ['nullable', 'mimes:jpeg,png,jpg', 'max:2048'],
            'payment_methods' => ['required', 'array'],
            'payment_methods.*.payment_method' => ['required', Rule::in(['cash', 'asuransi', 'perusahaan', 'lainnya', 'bpjs_kesehatan'])],
            'addresses' => ['array'],
            'addresses.*.address' => ['required'],
            'addresses.*.province' => ['required'],
            'addresses.*.city' => ['required'],
            'addresses.*.subdistrict' => ['required'],
            'addresses.*.ward' => ['required'],
            'addresses.*.postal_code' => ['required'],
        ];
    }


    public function messages(): array
    {
        return [
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'medical_record_number.unique' => 'Nomor pasien ini sudah terdaftar.',
            'city_of_birth.required' => 'Tempat lahir wajib diisi.',
            'date_of_birth.required' => 'Tanggal lahir wajib diisi.',
            'date_of_birth.date' => 'Tanggal lahir tidak valid!',
            'date_of_birth.date_format' => 'Format tanggal lahir tidak valid! Format: yyyy-mm-dd.',
            'id_card_number.required' => 'NIK wajib diisi.',
            'id_card_number.unique' => 'NIK ini sudah terdaftar.',
            'gender.required' => 'Jenis kelamin wajib diisi.',
            'gender.in' => 'Jenis kelamin tidak valid.',
            'religion.required' => 'Agama wajib diisi.',
            'blood_type.required' => 'Jenis kelamin wajib diisi.',
            'job.required' => 'Jabatan wajib diisi.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.unique' => 'Email sudah terdaftar.',
            'date_of_consultation.date_format' => 'Format tanggal lahir tidak valid! Format: yyyy-mm-dd.',
            'date_of_consultation.date' => 'Format tanggal lahir tidak valid.',
            'payment_methods.array' => 'Format data tidak valid.',
            'payment_methods.*.payment_method.required' => 'Metode pembayaran wajib diisi.',
            'payment_methods.*.payment_method.in' => 'Metode pembayaran tidak valid.',
            'payment_methods.*.bpjs_number.required' => 'BPJS tidak boleh kosong, jika memilih metode pembayaran BPJS kesehatan.',
            'payment_methods.*.bpjs_number.unique' => 'BPJS kesehatan sudah terdaftar.',
            'profile_picture.image' => 'Format gambar tidak valid.',
            'profile_picture.mimes' => 'Format gambar tidak valid, format didukung: jpeg, png, jpg.',
            'profile_picture.min' => 'Ukuran gambar maksimal 2MB',
            'patient_addresses.array' => 'Format data tidak valid.',
            'patient_addresses.*.address.required' => 'Alamat wajib diisi.',
            'patient_addresses.*.province.required' => 'Provinsi wajib diisi.',
            'patient_addresses.*.city.required' => 'Kota wajib diisi.',
            'patient_addresses.*.subdistrict.required' => 'Kecamatan wajib diisi.',
            'patient_addresses.*.ward.required' => 'Kelurahan wajib diisi.',
            'patient_addresses.*.postal_code.required' => 'Kode pos wajib diisi.',
        ];
    }
}
