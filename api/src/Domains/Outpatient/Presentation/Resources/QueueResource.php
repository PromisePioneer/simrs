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
            'called_at'           => $this->called_at,
            'finished_at'         => $this->finished_at,
            'outpatient_visit'    => $this->whenLoaded('outpatientVisit', fn() => [
                'id'      => $this->outpatientVisit?->id,
                'patient' => $this->outpatientVisit?->relationLoaded('patient') ? [
                    'id'   => $this->outpatientVisit->patient?->id,
                    'name' => $this->outpatientVisit->patient?->name,
                ] : null,
                'doctor'  => $this->outpatientVisit?->relationLoaded('doctor') ? [
                    'id'   => $this->outpatientVisit->doctor?->id,
                    'name' => $this->outpatientVisit->doctor?->name,
                ] : null,
            ]),
        ];
    }
}
