<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpecializationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'description'      => $this->description,
            'profession_id'    => $this->profession_id,
            'profession'       => $this->whenLoaded('profession', fn() => ['id' => $this->profession?->id, 'name' => $this->profession?->name]),
            'sub_specializations' => $this->whenLoaded('subSpecializations', fn() => SubSpecializationResource::collection($this->subSpecializations)),
        ];
    }
}
