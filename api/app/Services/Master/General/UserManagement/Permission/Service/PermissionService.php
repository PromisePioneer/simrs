<?php

namespace App\Services\Master\General\UserManagement\Permission\Service;

use App\Http\Requests\PermissionRequest;
use App\Services\Master\General\UserManagement\Permission\Repository\PermissionRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    protected PermissionRepository $permissionRepository;

    public function __construct()
    {
        $this->permissionRepository = new PermissionRepository();
    }

    public function getPermissions(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->permissionRepository->getPermissions($filters, $perPage);
    }

    public function store(PermissionRequest $request): array
    {
        $data = $request->validated();
        return $this->permissionRepository->store($data);
    }

    public function update(PermissionRequest $request, Permission $permission): array
    {
        $data = $request->validated();
        return $this->permissionRepository->update($permission->id, $data);
    }
}
