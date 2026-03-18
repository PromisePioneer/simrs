<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OutpatientVisitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'type'              => $this->type,
            'referred_hospital' => $this->referred_hospital,
            'referred_doctor'   => $this->referred_doctor,
            'date'              => $this->date,
            'complain'          => $this->complain,
            'status'            => $this->status,
            'patient'           => $this->whenLoaded('patient', fn() => ['id' => $this->patient?->id, 'name' => $this->patient?->name]),
            'doctor'            => $this->whenLoaded('doctor', fn() => ['id' => $this->doctor?->id, 'name' => $this->doctor?->name]),
            'vital_sign'        => $this->whenLoaded('vitalSign', fn() => $this->vitalSign),
            'diagnoses'         => $this->whenLoaded('diagnoses', fn() => $this->diagnoses),
            'procedures'        => $this->whenLoaded('procedures', fn() => $this->procedures),
            'prescriptions'     => $this->whenLoaded('prescriptions', fn() => $this->prescriptions),
            'created_at'        => $this->created_at?->toIso8601String(),
        ];
    }
}
