<?php

declare(strict_types=1);

namespace Domains\Patient\Presentation\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Form Request: Validasi HTTP untuk update data pasien.
 */
class UpdatePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array|string> */
    public function rules(): array
    {
        $patientId = $this->route('patient');

        return [
            'full_name'            => ['required', 'string', 'min:2'],
            'city_of_birth'        => ['required', 'string'],
            'date_of_birth'        => ['required', 'date', 'date_format:Y-m-d'],
            'id_card_number'       => [
                'required',
                'string',
                // Unique kecuali dirinya sendiri — ini validasi HTTP level,
                // business rule tetap di handler
                Rule::unique('patients', 'id_card_number')->ignore($patientId),
            ],
            'gender'               => ['required', Rule::in(['pria', 'wanita'])],
            'religion'             => ['nullable', 'string'],
            'blood_type'           => ['nullable', 'string'],
            'job'                  => ['required', 'string'],
            'phone'                => ['required', 'string'],
            'email'                => [
                'nullable',
                'email',
                Rule::unique('patients', 'email')->ignore($patientId),
            ],
            'date_of_consultation' => ['nullable', 'date', 'date_format:Y-m-d'],
            'kis_number'           => ['nullable', 'string'],
            'profile_picture'      => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],

            'addresses'                        => ['required', 'array', 'min:1'],
            'addresses.*.address'              => ['required', 'string'],
            'addresses.*.province'             => ['required', 'string'],
            'addresses.*.city'                 => ['required', 'string'],
            'addresses.*.subdistrict'          => ['required', 'string'],
            'addresses.*.ward'                 => ['required', 'string'],
            'addresses.*.postal_code'          => ['required', 'string'],

            'payment_methods'                           => ['required', 'array', 'min:1'],
            'payment_methods.*.payment_method_type_id'  => ['required', 'string', 'exists:payment_method_types,id'],
            'payment_methods.*.bpjs_number'             => ['nullable', 'string'],
        ];
    }
}
