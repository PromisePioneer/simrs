<?php

namespace App\Services\Master\General\UserManagement\Permission\Repository;

use App\Models\Permission;
use App\Services\Master\General\UserManagement\Permission\Interface\PermissionRepositoryInterface;

class PermissionRepository implements PermissionRepositoryInterface
{


    private Permission $permission;

    public function __construct()
    {
        $this->permission = new Permission();
    }

    public function getPermissions(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->permission->orderBy('name');

        if ($filters['search']) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): object
    {
        return $this->permission->findOrFail($id);
    }

    public function store(array $data = []): object
    {
        return $this->permission->create($data);
    }

    public function update(string $id, array $data = []): object
    {
        $permission = $this->permission->findOrFail($id);
        $permission->fill($data);
        $permission->save();

        return $permission;
    }

    public function destroy(string $id): object
    {
        $permission = $this->permission->findOrFail($id);
        $permission->delete();
        return $permission;
    }

    public static function getPermissionsByUser(object $user): array
    {

        return $user->roles->first()->permissions->pluck('name')->toArray();
    }


    public function getPermissionByModuleId(string $moduleId): ?object
    {
        return $this->permission->where('module_id', $moduleId);
    }


    public function removePermissionsFromModule(string $moduleId, array $permissionName): bool
    {
        return $this->permission->where('module_id', $moduleId)
            ->whereIn('name', $permissionName)
            ->delete();
    }
}
