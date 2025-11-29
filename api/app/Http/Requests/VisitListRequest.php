<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VisitListRequest extends FormRequest
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
            'type' => ['required', Rule::in('non_rujuk', 'rujuk')],
            'referred_hospital' => [Rule::requiredIf(fn() => $this->input('type') == 'rujuk')],
            'referred_doctor' => [Rule::requiredIf(fn() => $this->input('type') == 'rujuk')],
            'patient_id' => ['required', Rule::exists('patients', 'id')],
            'doctor_id' => ['required', Rule::exists('users', 'id')],
            'poli_id' => ['required', Rule::exists('poli', 'id')],
            'date' => ['required', 'date_format:Y-m-d H:i:s'],
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
            'full_name' => ['nullable'],
            'phone' => ['nullable'],
            'address' => ['nullable'],
        ];
    }


    public function messages(): array
    {
        return [
            'type.required' => 'Tipe tidak boleh kosong',
            'referred_hospital.required' => 'Referensi Rumah sakit Harus diisi',
            'referred_doctor.required' => 'Referensi Dokter Harus diisi',
            'patient_id.required' => 'Nama Pasien Harus diisi',
            'doctor_id.required' => 'Nama Dokter Harus diisi',
            'doctor_id.exists' => 'Nama Dokter tidak terdaftar',
            'poli_id.required' => 'Poli Harus diisi',
            'poli_id.exists' => 'Poli tidak terdaftar',
            'date.required' => 'Tanggal Harus diisi',
            'date.date_format' => 'Format Tanggal tidak valid.',
        ];
    }
}
