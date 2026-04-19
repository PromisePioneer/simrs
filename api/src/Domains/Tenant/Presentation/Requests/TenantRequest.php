<?php

declare(strict_types=1);

namespace Domains\Tenant\Presentation\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $tenantId = $this->route('tenant')?->id ?? $this->route('tenant');

        return [
            'name'             => 'required',
            'type'             => ['required', Rule::in('rs', 'klinik', 'beauty_clinic')],
            'sio'              => ['nullable'],
            'nib'              => ['nullable'],
            'npwp_full_name'   => ['nullable'],
            'npwp_type'        => ['nullable'],
            'nik_npwp'         => ['nullable', Rule::unique('tenants', 'nik_npwp')->ignore($tenantId)],
            'npwp_number'      => ['nullable', Rule::unique('tenants', 'npwp_number')->ignore($tenantId)],
            'npwp_address'     => ['nullable'],
            'npwp_province_id' => ['nullable', Rule::exists('provinces', 'id')],
            'npwp_district_id' => ['nullable', Rule::exists('districts', 'id')],
            'ktp_full_name'    => ['nullable'],
            'nik_ktp'          => ['nullable', Rule::unique('tenants', 'nik_ktp')->ignore($tenantId)],
            'ktp_attachment'   => ['nullable', 'mimes:jpeg,jpg,png', 'max:2048'],
            'pic_full_name'    => ['nullable'],
            'pic_role'         => ['nullable'],
            'pic_phone_number' => ['nullable'],
            'pic_email'        => ['nullable', Rule::unique('tenants', 'pic_email')->ignore($tenantId)],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama Tenant tidak boleh kosong',
            'type.required' => 'Jenis Tenant tidak boleh kosong',
            'sio.required'  => 'Jenis Tenant tidak boleh kosong',
        ];
    }
}
