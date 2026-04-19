<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'description'    => $this->description,
            'price'          => $this->price,
            'billing_period' => $this->billing_period,
            'max_users'      => $this->max_users,
            'is_active'      => $this->is_active,
            'modules'        => $this->whenLoaded('modules', fn() => $this->modules->map(fn($m) => [
                'id'   => $m->id,
                'name' => $m->name,
                'slug' => $m->slug,
            ])),
            'created_at'     => $this->created_at?->toDateTimeString(),
            'updated_at'     => $this->updated_at?->toDateTimeString(),
        ];
    }
}
