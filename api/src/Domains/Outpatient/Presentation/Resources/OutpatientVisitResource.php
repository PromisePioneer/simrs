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
            'id' => $this->id,
            'type' => $this->type,
            'referred_hospital' => $this->referred_hospital,
            'referred_doctor' => $this->referred_doctor,
            'poli_id' => $this->poli_id,
            'date' => $this->date,
            'complain' => $this->complain,
            'status' => $this->status,
            'poli' => $this->whenLoaded('poli', fn() => [
                'id' => $this->poli?->id,
                'name' => $this->poli?->name,
            ]),
            'patient' => $this->whenLoaded('patient', fn() => [
                'id' => $this->patient?->id,
                'full_name' => $this->patient?->full_name,
            ]),
            'doctor' => $this->whenLoaded('doctor', fn() => [
                'id' => $this->doctor?->id,
                'name' => $this->doctor?->name,
            ]),
            'vital_sign' => $this->whenLoaded('vitalSign', fn() => $this->vitalSign),
            'companion' => $this->whenLoaded('companion', fn() => $this->companion),
            'allergy' => $this->whenLoaded('allergy', fn() => $this->allergy),
            'medical_history' => $this->whenLoaded('medicalHistory', fn() => $this->medicalHistory),
            'family_medical_history' => $this->whenLoaded('familyMedicalHistory', fn() => $this->familyMedicalHistory),
            'psychosocial' => $this->whenLoaded('psychosocial', fn() => $this->psychosocial),
            'medication_history' => $this->whenLoaded('medicationHistory', fn() => $this->medicationHistory),
            'diagnoses' => $this->whenLoaded('diagnoses', fn() => $this->diagnoses),
            'procedures' => $this->whenLoaded('procedures', fn() => $this->procedures),
            'prescriptions' => $this->whenLoaded('prescriptions', fn() => $this->prescriptions),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
