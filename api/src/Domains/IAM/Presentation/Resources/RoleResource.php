<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'tenant_id' => $this->tenant_id,
            'name' => $this->name,
            'guard_name' => $this->guard_name,
            'permissions' => $this->permissions->map(fn($p) => [
                'uuid' => $p->uuid,
                'name' => $p->name,
                'description' => $p->description,
            ])->values(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
