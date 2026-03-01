<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class DiagnoseVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(Request $request): array
    {

        return [


            /*
            |--------------------------------------------------------------------------
            | DIAGNOSES (ICD-10)
            |--------------------------------------------------------------------------
            */
            'diagnoses' => ['required', 'array', 'min:1'],
            'diagnoses.*.icd10_code' => ['required', 'string', 'max:10'],
            'diagnoses.*.description' => ['required', 'string', 'max:255'],
            'diagnoses.*.type' => ['required', 'in:primary,secondary,comorbid'],

            /*
            |--------------------------------------------------------------------------
            | PROCEDURES (ICD-9)
            |--------------------------------------------------------------------------
            */

            'procedures' => ['required', 'array', 'min:1'],
            'procedures.*.icd9_code' => ['required', 'max:10', 'string'],
            'procedures.*.description' => ['required'],
            'procedures.*.procedure_date' => ['nullable'],
            'procedures.*.notes' => ['nullable'],

            /*
            |--------------------------------------------------------------------------
            | PRESCRIPTIONS
            |--------------------------------------------------------------------------
            */
            'prescriptions.*.medicine_id' => ['required', 'exists:medicines,id'],
            'prescriptions.*.dosage' => ['required', 'string'],
            'prescriptions.*.frequency' => ['required', 'string'],
            'prescriptions.*.duration' => ['required', 'string'],
            'prescriptions.*.route' => ['required', 'string'],
            'prescriptions.*.quantity' => ['required', 'integer', 'min:1'],
            'prescriptions.*.notes' => ['nullable', 'string'],

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

            // Prescription
            'prescriptions.*.medicine_id.required' => 'Nama obat wajib diisi.',
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
