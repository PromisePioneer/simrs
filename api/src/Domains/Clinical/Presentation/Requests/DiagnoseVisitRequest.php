<?php

declare(strict_types=1);

namespace Domains\Clinical\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DiagnoseVisitRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'diagnoses'                       => ['required', 'array', 'min:1'],
            'diagnoses.*.icd10_code'          => ['required', 'string', 'max:10'],
            'diagnoses.*.description'         => ['required', 'string', 'max:255'],
            'diagnoses.*.type'                => ['required', 'in:primary,secondary,comorbid'],

            'procedures'                      => ['required', 'array', 'min:1'],
            'procedures.*.icd9_code'          => ['required', 'max:10', 'string'],
            'procedures.*.name'               => ['required'],
            'procedures.*.description'        => ['required'],
            'procedures.*.notes'              => ['nullable'],

            'prescriptions.*.medicine_id'     => ['required', 'uuid', 'exists:medicines,id'],
            'prescriptions.*.dosage'          => ['required', 'string'],
            'prescriptions.*.frequency'       => ['required', 'string'],
            'prescriptions.*.duration'        => ['required', 'string'],
            'prescriptions.*.route'           => ['required', 'string'],
            'prescriptions.*.quantity'        => ['required', 'integer', 'min:1'],
            'prescriptions.*.notes'           => ['nullable', 'string'],

            'lab_results'                     => ['nullable', 'string', 'max:2000'],
            'radiology_results'               => ['nullable', 'string', 'max:2000'],
            'patient_education'               => ['nullable', 'string', 'max:2000'],
            'follow_up'                       => ['nullable', 'date'],
            'sick_leave_days'                 => ['nullable', 'integer', 'min:1', 'max:365'],
        ];
    }

    public function messages(): array
    {
        return [
            'diagnoses.required'                => 'Minimal harus ada satu diagnosis.',
            'diagnoses.*.icd10_code.required'   => 'Kode ICD-10 wajib diisi.',
            'diagnoses.*.description.required'  => 'Deskripsi diagnosis wajib diisi.',
            'diagnoses.*.type.in'               => 'Tipe diagnosis tidak valid.',
            'prescriptions.*.medicine_id.required' => 'Nama obat wajib diisi.',
            'prescriptions.*.dosage.required'   => 'Dosis obat wajib diisi.',
            'prescriptions.*.frequency.required'=> 'Frekuensi obat wajib dipilih.',
        ];
    }
}
