<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubSpecializationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'name'               => $this->name,
            'description'        => $this->description,
            'specialization_id'  => $this->specialization_id,
            'specialization'     => $this->whenLoaded('specialization', fn() => ['id' => $this->specialization?->id, 'name' => $this->specialization?->name]),
        ];
    }
}
