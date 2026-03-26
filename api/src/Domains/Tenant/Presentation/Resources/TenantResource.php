<?php

declare(strict_types=1);

namespace Domains\Tenant\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TenantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'code'             => $this->code,
            'name'             => $this->name,
            'type'             => $this->type,
            'sio'              => $this->sio,
            'nib'              => $this->nib,
            'npwp_full_name'   => $this->npwp_full_name,
            'npwp_type'        => $this->npwp_type,
            'nik_npwp'         => $this->nik_npwp,
            'npwp_number'      => $this->npwp_number,
            'npwp_address'     => $this->npwp_address,
            'npwp_province_id' => $this->npwp_province_id,
            'npwp_district_id' => $this->npwp_district_id,
            'npwp_province'    => $this->whenLoaded('npwpProvince'),
            'npwp_district'    => $this->whenLoaded('npwpDistrict'),
            'ktp_full_name'    => $this->ktp_full_name,
            'nik_ktp'          => $this->nik_ktp,
            'ktp_attachment'   => $this->ktp_attachment,
            'pic_full_name'    => $this->pic_full_name,
            'pic_role'         => $this->pic_role,
            'pic_phone_number' => $this->pic_phone_number,
            'pic_email'        => $this->pic_email,
            'created_at'       => $this->created_at,
            'updated_at'       => $this->updated_at,
        ];
    }
}
