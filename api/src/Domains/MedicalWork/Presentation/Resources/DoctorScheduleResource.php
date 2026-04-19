<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'day_of_week' => $this->day_of_week,
            'start_time'  => $this->start_time,
            'end_time'    => $this->end_time,
            'doctor'      => $this->whenLoaded('doctor', fn() => ['id' => $this->doctor?->id, 'name' => $this->doctor?->name]),
        ];
    }
}
