<?php

namespace Domains\MasterData\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegencyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'province' => ProvinceResource::make($this->whenLoaded('province')),
        ];
    }
}

