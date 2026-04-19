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
            'id'           => $this->id,
            'date'         => $this->date,
            'status'       => $this->status,
            'queue_number' => $this->queue_number,
            'notes'        => $this->notes,
            'patient'      => $this->whenLoaded('patient', fn() => ['id' => $this->patient?->id, 'name' => $this->patient?->name]),
            'doctor'       => $this->whenLoaded('doctor', fn() => ['id' => $this->doctor?->id, 'name' => $this->doctor?->name]),
            'created_at'   => $this->created_at?->toIso8601String(),
        ];
    }
}
