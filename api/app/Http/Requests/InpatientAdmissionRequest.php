<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class InpatientAdmissionRequest extends FormRequest
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
            'doctor_id' => ['required', 'exists:users,id'],
            'patient_id' => ['required', 'exists:patients,id'],
            'admitted_at' => ['required', 'date'],
            'discharged_at' => ['nullable', 'date'],
            'admission_source' => ['required', 'string'],
            'diagnosis' => ['required', 'string'],
            'temperature' => ['required', 'numeric'],
            'pulse_rate' => ['required', 'numeric'],
            'respiratory_rate' => ['required', 'numeric'],
            'systolic' => ['required', 'numeric'],
            'diastolic' => ['required', 'numeric'],
            'bed_id' => ['required', 'exists:beds,id'],
            'assigned_at' => ['required', 'date'],
            'released_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'doctor_id.required' => 'Dokter wajib dipilih.',
            'doctor_id.exists' => 'Dokter yang dipilih tidak ditemukan.',

            'patient_id.required' => 'Pasien wajib dipilih.',
            'patient_id.exists' => 'Pasien yang dipilih tidak ditemukan.',

            'admitted_at.required' => 'Tanggal masuk wajib diisi.',
            'admitted_at.date' => 'Format tanggal masuk tidak valid.',

            'discharged_at.required' => 'Tanggal keluar wajib diisi.',
            'discharged_at.date' => 'Format tanggal keluar tidak valid.',

            'admission_source.required' => 'Sumber penerimaan wajib diisi.',
            'admission_source.string' => 'Sumber penerimaan harus berupa teks.',

            'status.required' => 'Status wajib dipilih.',
            'status.string' => 'Status harus berupa teks.',
            'status.in' => 'Status harus salah satu dari: admitted, discharged, atau cancelled.',

            'diagnosis.required' => 'Diagnosis wajib diisi.',
            'diagnosis.string' => 'Diagnosis harus berupa teks.',

            'temperature.required' => 'Suhu tubuh wajib diisi.',
            'temperature.numeric' => 'Suhu tubuh harus berupa angka.',

            'pulse_rate.required' => 'Detak nadi wajib diisi.',
            'pulse_rate.numeric' => 'Detak nadi harus berupa angka.',

            'respiratory_rate.required' => 'Laju pernapasan wajib diisi.',
            'respiratory_rate.numeric' => 'Laju pernapasan harus berupa angka.',

            'systolic.required' => 'Tekanan darah sistolik wajib diisi.',
            'systolic.numeric' => 'Tekanan darah sistolik harus berupa angka.',

            'diastolic.required' => 'Tekanan darah diastolik wajib diisi.',
            'diastolic.numeric' => 'Tekanan darah diastolik harus berupa angka.',

            'bed_id.required' => 'Tempat tidur wajib dipilih.',
            'bed_id.exists' => 'Tempat tidur yang dipilih tidak ditemukan.',

            'assigned_at.required' => 'Tanggal penempatan tempat tidur wajib diisi.',
            'assigned_at.date' => 'Format tanggal penempatan tempat tidur tidak valid.',

            'released_at.date' => 'Format tanggal pelepasan tempat tidur tidak valid.',
        ];
    }
}
