<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'description'      => $this->description,
            'specializations'  => $this->whenLoaded('specializations', fn() =>
                SpecializationResource::collection($this->specializations)
            ),
        ];
    }
}
