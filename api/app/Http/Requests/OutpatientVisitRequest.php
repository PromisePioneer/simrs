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
            ''
        ];
    }
}
