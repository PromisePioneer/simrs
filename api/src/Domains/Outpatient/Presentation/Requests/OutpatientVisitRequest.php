<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OutpatientVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:rujuk,non_rujuk'],
            'referred_hospital' => ['nullable', 'string'],
            'referred_doctor' => ['nullable', 'string'],
            'patient_id' => ['required', 'uuid', 'exists:patients,id'],
            'doctor_id' => ['required', 'uuid', 'exists:users,id'],
            'poli_id' => ['required', 'uuid', 'exists:poli,id'],
            'date' => ['required', 'date_format:Y-m-d H:i:s'],
            'complain' => ['required'],

            // Vital signs
            'height' => ['nullable', 'numeric'],
            'weight' => ['nullable', 'numeric'],
            'temperature' => ['nullable', 'numeric'],
            'pulse_rate' => ['nullable', 'numeric'],
            'respiratory_frequency' => ['nullable', 'numeric'],
            'systolic' => ['nullable', 'numeric'],
            'diastolic' => ['nullable', 'numeric'],
            'abdominal_circumference' => ['nullable', 'numeric'],
            'blood_sugar' => ['nullable', 'numeric'],
            'oxygen_saturation' => ['nullable', 'numeric'],

            // Companion
            'companion_name' => ['nullable', 'string'],
            'companion_phone' => ['nullable', 'string'],
            'companion_address' => ['nullable', 'string'],

            // Anamnesis
            'patient_allergy' => ['nullable', 'array'],
            'patient_allergy.*.name' => ['nullable', 'string'],
            'patient_medical_history' => ['nullable', 'array'],
            'patient_medical_history.*.condition' => ['nullable', 'string'],
            'patient_family_medical_history' => ['nullable', 'array'],
            'patient_family_medical_history.*.condition' => ['nullable', 'string'],
            'patient_medication_history' => ['nullable', 'array'],
            'patient_medication_history.*.medication' => ['nullable', 'string'],

            // Psychosocial & Spiritual
            'psychology_condition' => ['nullable', 'array'],
            'psychology_condition.*.condition' => ['nullable', 'string'],
            'marital_status' => ['nullable', 'string', 'in:menikah,belum_menikah,janda_atau_duda'],
            'live_with' => ['nullable', 'string', 'in:sendiri,orang_tua,suami_atau_istri,lainnya'],
            'job' => ['nullable', 'string', 'in:wiraswasta,swasta,pns,lainnya'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Tipe kunjungan wajib dipilih.',
            'patient_id.required' => 'Pasien wajib dipilih.',
            'doctor_id.required' => 'Dokter wajib dipilih.',
            'poli_id.required' => 'Poli wajib dipilih.',
            'date.required' => 'Tanggal kunjungan wajib diisi.',
            'complain.required' => 'Keluhan utama wajib diisi.',
        ];
    }
}
