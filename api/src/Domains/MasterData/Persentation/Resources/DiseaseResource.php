<?php

namespace Domains\MasterData\Persentation\Resources;


use Domains\MasterData\Infrastructure\Persistent\Models\DiseaseModel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiseaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'symptoms' => $this->symptoms,
            'description' => $this->description,
            'valid_code' => $this->valid_code,
            'accpdx' => $this->accpdx,
            'asterisk' => $this->asterisk,
            'im' => $this->im,
            'status' => $this->status
        ];
    }
}
