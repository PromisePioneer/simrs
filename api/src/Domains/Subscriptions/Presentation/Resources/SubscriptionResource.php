<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'tenant_id'     => $this->tenant_id,
            'status'        => $this->status,
            'starts_at'     => $this->starts_at?->toDateTimeString(),
            'ends_at'       => $this->ends_at?->toDateTimeString(),
            'trial_ends_at' => $this->trial_ends_at?->toDateTimeString(),
            'cancelled_at'  => $this->cancelled_at?->toDateTimeString(),
            'plan'          => $this->whenLoaded('plan', fn() => new PlanResource($this->plan)),
            'created_at'    => $this->created_at?->toDateTimeString(),
        ];
    }
}
