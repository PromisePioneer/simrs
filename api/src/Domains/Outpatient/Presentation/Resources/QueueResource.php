<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QueueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'queue_number'        => $this->queue_number,
            'service_unit'        => $this->service_unit,
            'queue_date'          => $this->queue_date,
            'status'              => $this->status,
            'priority'            => $this->priority,
            'called_at'           => $this->called_at,
            'finished_at'         => $this->finished_at,
            'outpatient_visit'    => $this->whenLoaded('outpatientVisit', fn() => [
                'id'       => $this->outpatientVisit?->id,
                'type'     => $this->outpatientVisit?->type,
                'complain' => $this->outpatientVisit?->complain,
                'date'     => $this->outpatientVisit?->date,
                'poli_id'  => $this->outpatientVisit?->poli_id,
                'patient'  => $this->outpatientVisit?->relationLoaded('patient') ? [
                    'id'            => $this->outpatientVisit->patient?->id,
                    'full_name'     => $this->outpatientVisit->patient?->full_name,
                    'date_of_birth' => $this->outpatientVisit->patient?->date_of_birth?->toDateString(),
                    'gender'        => $this->outpatientVisit->patient?->gender,
                    'phone'         => $this->outpatientVisit->patient?->phone,
                ] : null,
                'doctor'   => $this->outpatientVisit?->relationLoaded('doctor') ? [
                    'id'   => $this->outpatientVisit->doctor?->id,
                    'name' => $this->outpatientVisit->doctor?->name,
                ] : null,
            ]),
        ];
    }
}
