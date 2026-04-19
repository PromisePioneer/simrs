<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $userId = $this->route('user');
        return [
            'name'     => ['required', 'string'],
            'email'    => ['required', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'phone'    => ['required', 'string'],
            'address'  => ['required', 'string'],
            'roles'    => ['required', 'array'],
            'roles.*'  => ['string', 'exists:roles,name'],

            'poli_id'                 => ['nullable', 'uuid', 'exists:poli,id'],
            'str_institution_id'      => ['nullable', 'uuid'],
            'str_registration_number' => ['nullable', 'string'],
            'str_active_period'       => [Rule::requiredIf(fn() => !empty($this->str_registration_number))],
            'sip_institution_id'      => ['nullable', 'uuid'],
            'sip_registration_number' => ['nullable', 'string'],
            'sip_active_period'       => [Rule::requiredIf(fn() => !empty($this->sip_registration_number))],

            'degrees'         => ['nullable', 'array'],
            'degrees.*.id'    => ['required', 'uuid', 'exists:degrees,id'],
            'degrees.*.order' => ['nullable', 'integer'],

            'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'signature'       => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],

            'doctor_schedule'               => ['nullable', 'array'],
            'doctor_schedule.*.day_of_week' => ['required', Rule::in(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'])],
            'doctor_schedule.*.start_time'  => ['required', 'date_format:H:i'],
            'doctor_schedule.*.end_time'    => ['required', 'date_format:H:i', 'after:doctor_schedule.*.start_time'],
        ];
    }
}
