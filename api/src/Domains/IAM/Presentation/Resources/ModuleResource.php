<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'route'               => $this->route,
            'parent_id'           => $this->parent_id,
            'icon'                => $this->icon,
            'order'               => $this->order,
            'permissions'         => PermissionResource::collection($this->whenLoaded('permissions')),
            'children_recursive'  => ModuleResource::collection($this->whenLoaded('childrenRecursive')),
            'created_at'          => $this->created_at?->toIso8601String(),
            'updated_at'          => $this->updated_at?->toIso8601String(),
        ];
    }
}
