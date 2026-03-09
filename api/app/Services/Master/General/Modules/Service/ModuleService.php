<?php

namespace App\Services\Master\General\Modules\Service;

use App\Http\Requests\ModuleRequest;
use App\Models\Module;
use App\Models\Permission;
use App\Services\Master\General\Modules\Repository\ModuleRepository;
use App\Services\Master\General\Modules\Traits\ModuleAccess;
use App\Services\Master\General\UserManagement\Permission\Repository\PermissionRepository;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Throwable;

class ModuleService
{

    use ModuleAccess;

    protected ModuleRepository $moduleRepository;
    private PermissionRepository $permissionRepository;

    public function __construct()
    {
        $this->moduleRepository = new ModuleRepository();
        $this->permissionRepository = new PermissionRepository();
    }

    public function getModules(): Collection
    {
        setPermissionsTeamId(TenantContext::getId());
        $user = auth()->user();

        $userPermissions = PermissionRepository::getPermissionsByUser($user);
        $roleName = $user->getActiveRole()->name;


        if ($user->hasRole('Super Admin')) {
            return $this->moduleRepository->getModules(
                roleName: $roleName,
                user: $user,
                userPermissions: $userPermissions
            );
        }

        return self::getAccessibleMenu();
    }

    public function getPaginatedModules(Request $request): array|LengthAwarePaginator
    {
        $perPage = $request->input('per_page', 20);
        $search = $request->input('search');
        $query = Module::query()->with(['childrenRecursive', 'permissions'])->whereNull('parent_id');

        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            });
        }
        return $query->orderBy('order')->paginate($perPage);
    }


    /**
     * @throws Throwable
     */
    public function store(ModuleRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $module = $this->moduleRepository->store($data);

            if (!empty($data['permissions'])) {
                foreach ($data['permissions'] as $permName) {
                    $permissionData = [
                        'name' => $permName,
                        'tenant_id' => $request->user()->tenant_id ?? null,
                        'module_id' => $module->id,
                    ];
                    $this->permissionRepository->store($permissionData);
                }
            }

            return $module->load('permissions');
        });
    }

    public function updatedModule(Request $request)
    {
        try {
            DB::beginTransaction();

            $requestModuleIds = collect($request->modules)
                ->filter(fn($m) => !str_starts_with($m['id'], 'new-'))
                ->pluck('id')
                ->toArray();

            // Delete modules that are not in the request
            Module::whereNotIn('id', $requestModuleIds)->delete();

            $newModules = [];
            $existingModules = [];

            // Separate new and existing modules
            foreach ($request->modules as $moduleData) {
                if (str_starts_with($moduleData['id'], 'new-')) {
                    $newModules[] = $moduleData;
                } else {
                    $existingModules[] = $moduleData;
                }
            }

            // Bulk create new modules
            foreach ($newModules as $moduleData) {
                Module::create([
                    'name' => $moduleData['name'],
                    'route' => $moduleData['route'],
                    'parent_id' => $moduleData['parent_id'],
                    'icon' => $moduleData['icon'],
                    'order' => $moduleData['order'],
                ]);
            }

            // Bulk update existing modules
            foreach ($existingModules as $moduleData) {
                Module::where('id', $moduleData['id'])->update([
                    'name' => $moduleData['name'],
                    'route' => $moduleData['route'],
                    'parent_id' => $moduleData['parent_id'],
                    'icon' => $moduleData['icon'],
                    'order' => $moduleData['order'],
                ]);
            }

            DB::commit();

            return Module::with(['permissions', 'childrenRecursive.permissions'])
                ->whereNull('parent_id')
                ->orderBy('order')
                ->get();
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'message' => 'Failed to update modules',
                'error' => $e->getMessage()
            ];
        }
    }


    /**
     * @throws Throwable
     */
    public function update(ModuleRequest $request, Module $module)
    {
        return DB::transaction(function () use ($request, $module) {
            $data = $request->validated();
            $module->update($data);
            if (array_key_exists('permissions', $data)) {
                $existingPermissions = $this->permissionRepository
                    ->getPermissionByModuleId($module->id)
                    ->pluck('name')
                    ->toArray();
                $newPermissions = $data['permissions'] ?? [];
                $toAdd = array_diff($newPermissions, $existingPermissions);
                foreach ($toAdd as $permName) {
                    $permissionData = [
                        'name' => $permName,
                        'tenant_id' => $request->user()->tenant_id ?? null,
                        'module_id' => $module->id,
                    ];
                    $this->permissionRepository->store($permissionData);
                }

                $toDelete = array_diff($existingPermissions, $newPermissions);
                if (!empty($toDelete)) {
                    $this->permissionRepository->removePermissionsFromModule($module->id, $toDelete);
                }
            }

            return $module->load('permissions');
        });
    }

    /**
     * @throws Throwable
     */
    public function destroy(Module $module)
    {
        return DB::transaction(function () use ($module) {
            $this->deleteModulePermissionsRecursively($module);
            $this->deleteModuleRecursively($module);
            return response()->json([
                'message' => 'Module dan permissions berhasil dihapus'
            ]);
        });
    }


    private function deleteModulePermissionsRecursively(Module $module): void
    {
        $permissions = Permission::where('module_id', $module->id)->get();
        foreach ($permissions as $permission) {
            $permission->roles()->detach();
            $permission->delete();
        }

        foreach ($module->children as $child) {
            $this->deleteModulePermissionsRecursively($child);
        }
    }

    private function deleteModuleRecursively(Module $module): void
    {
        foreach ($module->children as $child) {
            $this->deleteModuleRecursively($child);
        }

        $module->delete();
    }
}
