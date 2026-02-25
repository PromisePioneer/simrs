<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DiagnoseVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {



        return [

            /*
            |--------------------------------------------------------------------------
            | DIAGNOSES (ICD-10)
            |--------------------------------------------------------------------------
            */
            'diagnoses' => 'required|array|min:1',
            'diagnoses.*.icd_code' => 'required|string|max:10',
            'diagnoses.*.description' => 'required|string|max:255',
            'diagnoses.*.type' => 'required|in:primary,secondary,comorbid',

            /*
            |--------------------------------------------------------------------------
            | PROCEDURES (ICD-9)
            |--------------------------------------------------------------------------
            */
            'procedures' => 'nullable|array',
            'procedures.*.code' => 'nullable|string|max:10',
            'procedures.*.name' => 'nullable|string|max:255',
            'procedures.*.description' => 'required|string|max:255',

            /*
            |--------------------------------------------------------------------------
            | PRESCRIPTIONS
            |--------------------------------------------------------------------------
            */
            'prescriptions' => 'nullable|array',
            'prescriptions.*.medicine_name' => 'required|string|max:255',
            'prescriptions.*.dosage' => 'required|string|max:100',
            'prescriptions.*.frequency' => 'required|string|max:50',
            'prescriptions.*.duration' => 'nullable|string|max:100',
            'prescriptions.*.route' => 'nullable|string|max:50',
            'prescriptions.*.notes' => 'nullable|string|max:500',

            /*
            |--------------------------------------------------------------------------
            | PENUNJANG
            |--------------------------------------------------------------------------
            */
            'lab_results' => 'nullable|string|max:2000',
            'radiology_results' => 'nullable|string|max:2000',

            /*
            |--------------------------------------------------------------------------
            | EDUKASI & FOLLOW UP
            |--------------------------------------------------------------------------
            */
            'patient_education' => 'nullable|string|max:2000',
            'follow_up' => 'nullable|date',

            /*
            |--------------------------------------------------------------------------
            | RUJUKAN
            |--------------------------------------------------------------------------
            */
//            'referral' => 'required|in:none,poli,rs,rawat_inap',
//            'referral_destination' => 'required_if:referral,poli,rs,rawat_inap|string|max:255',

            /*
            |--------------------------------------------------------------------------
            | SURAT SAKIT
            |--------------------------------------------------------------------------
            */
            'sick_leave_days' => 'nullable|integer|min:1|max:365',
        ];
    }

    public function messages(): array
    {
        return [

            // Diagnoses
            'diagnoses.required' => 'Minimal harus ada satu diagnosis.',
            'diagnoses.*.icd_code.required' => 'Kode ICD-10 wajib diisi.',
            'diagnoses.*.description.required' => 'Deskripsi diagnosis wajib diisi.',
            'diagnoses.*.type.in' => 'Tipe diagnosis tidak valid.',

            // Prescriptions
            'prescriptions.*.medicine_name.required' => 'Nama obat wajib diisi.',
            'prescriptions.*.dosage.required' => 'Dosis obat wajib diisi.',
            'prescriptions.*.frequency.required' => 'Frekuensi obat wajib dipilih.',

            // Referral
            'referral.required' => 'Status rujukan wajib dipilih.',
            'referral_destination.required_if' => 'Tujuan rujukan wajib diisi jika ada rujukan.',

            // Sick Leave
            'sick_leave_days.integer' => 'Jumlah hari sakit harus berupa angka.',
            'sick_leave_days.min' => 'Minimal surat sakit 1 hari.',
            'sick_leave_days.max' => 'Maksimal surat sakit 365 hari.',

            // Follow Up
            'follow_up.date' => 'Format tanggal kontrol ulang tidak valid.',
        ];
    }
}
