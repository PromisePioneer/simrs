<?php

declare(strict_types=1);

namespace Domains\Accounting\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'code'                => $this->code,
            'name'                => $this->name,
            'parent_id'           => $this->parent_id,
            'account_category_id' => $this->account_category_id,
            'children'            => $this->whenLoaded('children', fn() => AccountResource::collection($this->children)),
        ];
    }
}
