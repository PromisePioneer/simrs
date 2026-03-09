<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AppointmentRequest extends FormRequest
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
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'date' => ['required', 'date'],
            'queue_number' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ];
    }


    public function messages(): array
    {
        return [
            'patient_id.required' => 'Pasien tidak boleh kosong.',
            'patient_id.exists' => 'Pasien tidak valid.',
            'doctor_id.required' => 'Dokter tidak boleh kosong.',
            'doctor_id.exists' => 'Dokter tidak valid.',
            'date.required' => 'Tanggal tidak boleh kosong.',
            'date.date' => 'Tanggal tidak valid.',
            'queue_number.required' => 'Queue tidak boleh kosong.',
            'queue_number.integer' => 'Queue tidak valid.',
            'queue_number.min' => 'Queue tidak valid.',
            'queue_number.max' => 'Queue tidak valid.',
            'notes.required' => 'Catatan tidak boleh kosong.',
        ];
    }
}
