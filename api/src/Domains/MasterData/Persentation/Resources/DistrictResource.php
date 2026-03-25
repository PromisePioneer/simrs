<?php

namespace Domains\MasterData\Persentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DistrictResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'regency' => RegencyResource::make($this->whenLoaded('regency')),
        ];
    }
}
