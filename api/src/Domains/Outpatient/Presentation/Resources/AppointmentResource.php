<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'visit_number'           => $this->visit_number,
            'reg_number'             => $this->reg_number,
            'date'                   => $this->date?->toIso8601String(),
            'emr'                    => $this->emr,
            'status'                 => $this->status,
            'registration_status'    => $this->registration_status,
            'advanced_status'        => $this->advanced_status,
            'guarantor_name'         => $this->guarantor_name,
            'guarantor_address'      => $this->guarantor_address,
            'guarantor_relationship' => $this->guarantor_relationship,
            'registration_fee'       => $this->registration_fee,
            'patient' => $this->whenLoaded('patient', fn() => [
                'id'        => $this->patient?->id,
                'full_name' => $this->patient?->full_name,
                'emr' => $this->patient?->medical_record_number
            ]),
            'outpatient_visit' => $this->whenLoaded('outpatientVisit', fn() => [
                'id'     => $this->outpatientVisit?->id,
                'status' => $this->outpatientVisit?->status,
            ]),
            'inpatient_admission' => $this->whenLoaded('inpatientAdmission', fn() => [
                'id'     => $this->inpatientAdmission?->id,
                'status' => $this->inpatientAdmission?->status,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
