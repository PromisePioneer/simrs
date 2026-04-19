<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'patient_id'   => ['required', 'uuid', 'exists:patients,id'],
            'doctor_id'    => ['required', 'uuid', 'exists:users,id'],
            'poli_id'      => ['required', 'uuid', 'exists:poli,id'],
            'date'         => ['required', 'date'],
            'status'       => ['nullable', 'string'],
            'queue_number' => ['nullable', 'string'],
            'notes'        => ['nullable', 'string'],
        ];
    }
}
