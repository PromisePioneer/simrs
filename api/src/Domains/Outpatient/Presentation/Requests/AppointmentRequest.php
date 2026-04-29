<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'visit_number' => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'regex:/^\d{4}\/\d{2}\/\d{2}\/\d{6}$/',
                Rule::unique('appointments', 'visit_number')->ignore($this->route('appointment')),
            ],
            'reg_number'             => ['nullable', 'string', 'max:8'],
            'date'                   => [$isUpdate ? 'sometimes' : 'required', 'date'],
            'emr'                    => ['nullable', 'string'],
            'patient_id'             => ['nullable', 'uuid', 'exists:patients,id'],
            'outpatient_visit_id'    => ['nullable', 'uuid', 'exists:outpatient_visits,id'],
            'inpatient_admission_id' => ['nullable', 'uuid', 'exists:inpatient_admissions,id'],
            'guarantor_name'         => ['nullable', 'string', 'max:255'],
            'guarantor_address'      => ['nullable', 'string'],
            'guarantor_relationship' => ['nullable', 'string', 'max:100'],
            'registration_fee'       => ['nullable', 'numeric', 'min:0'],
            'status' => [
                'nullable',
                Rule::in([
                    'not_yet', 'already', 'canceled', 'files_received',
                    'refered', 'died', 'in_treatment', 'forced_return',
                ]),
            ],
            'registration_status' => ['nullable', Rule::in(['-', 'old', 'new'])],
            'advanced_status'     => ['nullable', Rule::in(['inpatient', 'outpatient'])],
            'birth_date'          => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'visit_number.regex' => 'Format visit number tidak valid. Gunakan format YYYY/MM/DD/XXXXXX.',
        ];
    }
}
