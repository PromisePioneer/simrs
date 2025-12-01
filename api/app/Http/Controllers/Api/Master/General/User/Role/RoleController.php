<?php

namespace App\Http\Controllers\Api\Master\General\User\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Models\Role;
use App\Services\Master\General\UserManagement\Role\Service\RoleService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class RoleController extends Controller
{
    use ApiResponse;

    protected RoleService $roleService;

    public function __construct()
    {
        $this->roleService = new RoleService();
    }


    public function index(Request $request)
    {
        setPermissionsTeamId(auth()->user()->tenant_id);
        $this->authorize('view', Role::class);
        $roles = $this->roleService->getRoles($request);
        return response()->json($roles);
    }


    /**
     * @throws Throwable
     */
    public function store(RoleRequest $request)
    {
        $this->authorize('create', Role::class);
        $data = $this->roleService->store($request);
        return $this->successResponse($data, 'role created successfully.');
    }


    /**
     * @throws Throwable
     */
    public function update(RoleRequest $request, Role $role)
    {

        $this->authorize('update', $role);

        $roles = $this->roleService->update($request, $role);
        return $this->successResponse($roles, 'role updated successfully.');
    }


    public function show(Role $role): JsonResponse
    {
        $this->authorize('view', $role);

        $role = $this->roleService->show($role);
        return response()->json($role);
    }


    public function destroy(Role $role): JsonResponse
    {
        Role::where('uuid', $role->uuid)->delete();
        return $this->successResponse($role, 'role deleted successfully.');
    }
}
