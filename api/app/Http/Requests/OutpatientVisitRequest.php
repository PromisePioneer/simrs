<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class OutpatientVisitRequest extends FormRequest
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
            'type' => ['required', 'in:rujuk,non_rujuk'],
            'referred_hospital' => ['nullable', 'string'],
            'referred_doctor' => ['nullable', 'string'],
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:users,id'],
            'poli_id' => ['required', 'exists:poli,id'],
            'date' => ['required', 'date_format:Y-m-d H:i:s'],
            'complain' => ['required'],
            'height' => ['nullable'],
            'weight' => ['nullable'],
            'temperature' => ['nullable'],
            'pulse_rate' => ['nullable'],
            'respiratory_frequency' => ['nullable'],
            'systolic' => ['nullable'],
            'diastolic' => ['nullable'],
            'abdominal_circumference' => ['nullable'],
            'blood_sugar' => ['nullable'],
            'oxygen_saturation' => ['nullable'],
            'companion_full_name' => ['nullable'],
            'companion_phone' => ['nullable'],
            'companion_address' => ['nullable'],
            'allergies.*.name' => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Tipe kunjungan wajib dipilih.',
            'type.in' => 'Tipe kunjungan tidak valid.',

            'referred_hospital.string' => 'Nama rumah sakit rujukan harus berupa teks.',
            'referred_doctor.string' => 'Nama dokter rujukan harus berupa teks.',

            'patient_id.required' => 'Pasien wajib dipilih.',
            'patient_id.exists' => 'Data pasien tidak ditemukan.',

            'doctor_id.required' => 'Dokter wajib dipilih.',
            'doctor_id.exists' => 'Data dokter tidak ditemukan.',

            'poli_id.required' => 'Poli wajib dipilih.',
            'poli_id.exists' => 'Data poli tidak ditemukan.',

            'date.required' => 'Tanggal kunjungan wajib diisi.',
            'date.date_format' => 'Format tanggal tidak sesuai. Gunakan format Y-m-d H:i:s.',

            'complain.required' => 'Keluhan utama wajib diisi.',

            'height.numeric' => 'Tinggi badan harus berupa angka.',
            'weight.numeric' => 'Berat badan harus berupa angka.',
            'temperature.numeric' => 'Suhu tubuh harus berupa angka.',
            'pulse_rate.numeric' => 'Nadi harus berupa angka.',
            'respiratory_frequency.numeric' => 'Frekuensi pernapasan harus berupa angka.',
            'systolic.numeric' => 'Tekanan darah sistolik harus berupa angka.',
            'diastolic.numeric' => 'Tekanan darah diastolik harus berupa angka.',
            'abdominal_circumference.numeric' => 'Lingkar perut harus berupa angka.',
            'blood_sugar.numeric' => 'Gula darah harus berupa angka.',
            'oxygen_saturation.numeric' => 'Saturasi oksigen harus berupa angka.',

            'companion_full_name.string' => 'Nama pendamping harus berupa teks.',
            'companion_phone.string' => 'Nomor telepon pendamping harus berupa teks.',
            'companion_address.string' => 'Alamat pendamping harus berupa teks.',

            'allergies.*.name.string' => 'Nama alergi harus berupa teks.',
        ];
    }
}
