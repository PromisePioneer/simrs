<?php

namespace App\Services\Master\General\UserManagement\Role\Service;

use App\Http\Requests\RoleRequest;
use App\Models\Role;
use App\Services\Master\General\UserManagement\Role\Repository\RoleRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Throwable;

class RoleService
{

    private RoleRepository $roleRepository;

    public function __construct()
    {
        $this->roleRepository = new RoleRepository();
    }

    public function getRoles(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $paginate = $request->input('per_page');
        return $this->roleRepository->getRoles($filters, $paginate);
    }


    /**
     * @throws Throwable
     */
    public function store(RoleRequest $request): array
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $role = $this->roleRepository->store($data);
            $role->syncPermissions($request->permissions);
            return [
                'role' => $role,
                'permissions' => $request->permissions,
            ];
        });
    }


    public function show(Role $role): Role
    {
        $role->load(['permissions' => function ($query) {
            $query->orderBy('name', 'DESC');
        }]);

        return $role;
    }

    /**
     * @throws Throwable
     */
    public function update(RoleRequest $request, Role $role): array
    {
        return DB::transaction(function () use ($request, $role) {
            $data = $request->validated();
            $role = $this->roleRepository->update($role->uuid, $data);
            $role->syncPermissions($request->permissions);
            return [
                'role' => $role->fresh(),
                'permissions' => $role->permissions,
            ];
        });
    }

}
