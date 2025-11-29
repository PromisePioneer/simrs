<?php

namespace App\Http\Controllers\Api\Master\General\User\Permission;

use App\Http\Controllers\Controller;
use App\Http\Requests\PermissionRequest;
use App\Models\Permission;
use App\Services\Master\General\UserManagement\Permission\Repository\PermissionRepository;
use App\Services\Master\General\UserManagement\Permission\Service\PermissionService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{

    use ApiResponse;

    protected PermissionService $permissionService;

    public function __construct()
    {
        $this->permissionService = new PermissionService();
    }


    public function index(Request $request)
    {
        $permissions = $this->permissionService->getPermissions($request);
        return response()->json($permissions);
    }


    public function store(PermissionRequest $request)
    {
        $data = $this->permissionService->store($request);
        return $this->successResponse($data, 'Permission created successfully.');
    }


    public function update(PermissionRequest $request, Permission $permission)
    {
        $data = $this->permissionService->update($request, $permission);
        return $this->successResponse($data, 'Permission updated successfully.');
    }


    public function show(Permission $permission, PermissionRepository $permissionRepository)
    {
        $permission = $permissionRepository->findById($permission->id);
        return response()->json($permission);
    }


    public function destroy(Permission $permission, PermissionRepository $permissionRepository)
    {
        $permission = $permissionRepository->destroy($permission->id);
        return $this->successResponse($permission, 'Permission deleted successfully.');
    }
}
