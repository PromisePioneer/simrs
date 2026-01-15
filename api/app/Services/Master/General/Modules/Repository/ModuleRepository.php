<?php

namespace App\Services\Master\General\Modules\Repository;

use App\Models\Module;
use App\Services\Master\General\Modules\Interface\ModuleRepositoryInterface;

class ModuleRepository implements ModuleRepositoryInterface
{
    private Module $model;

    public function __construct()
    {
        $this->model = new Module();
    }

    public function getModules(?string $roleName, object $user, array $userPermissions): ?object
    {

        return match ($roleName) {
            'Super Admin' => $this->model->whereNull('parent_id')
                ->orderBy('order')
                ->with(['permissions', 'childrenRecursive.permissions'])
                ->get(),
            default => $this->model->whereNull('parent_id')
                ->orderBy('order')
                ->with(['childrenRecursive' => function ($query) use ($userPermissions) {
                    $query->orderBy('order');
                }, 'permissions', 'childrenRecursive.permissions'])
                ->get(['id', 'name', 'route', 'parent_id', 'icon', 'order'])
        };
    }

    public function store(array $data = []): ?object
    {
        return $this->model->create($data);
    }
}
