<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Services;

use Domains\IAM\Application\Traits\ModuleAccess;
use Domains\IAM\Domain\Repository\ModuleRepositoryInterface;
use Domains\IAM\Domain\Repository\PermissionRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\PermissionModel;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Throwable;

class ModuleService
{
    use ModuleAccess;

    public function __construct(
        private readonly ModuleRepositoryInterface      $moduleRepository,
        private readonly PermissionRepositoryInterface  $permissionRepository,
    ) {}

    public function getModules(): Collection
    {
        setPermissionsTeamId(TenantContext::getId());

        $user            = auth()->user();
        $userPermissions = $this->permissionRepository->getPermissionsByUser($user);
        $roleName        = $user->getActiveRole()->name;

        if ($user->hasRole('Super Admin')) {
            return $this->moduleRepository->getModules(
                roleName: $roleName,
                user: $user,
                userPermissions: $userPermissions,
            );
        }

        return self::getAccessibleMenu();
    }

    public function getPaginatedModules(Request $request): object
    {
        return $this->moduleRepository->getPaginated(
            filters: $request->only(['search']),
            perPage: (int) $request->input('per_page', 20),
        );
    }

    /** @throws Throwable */
    public function store(array $data, ?string $tenantId = null): object
    {
        return DB::transaction(function () use ($data, $tenantId) {
            $module = $this->moduleRepository->store($data);

            if (!empty($data['permissions'])) {
                foreach ($data['permissions'] as $permName) {
                    $this->permissionRepository->store([
                        'name'      => $permName,
                        'tenant_id' => $tenantId,
                        'module_id' => $module->id,
                    ]);
                }
            }

            return $this->moduleRepository->findById($module->id);
        });
    }

    /** @throws Throwable */
    public function update(string $moduleId, array $data, ?string $tenantId = null): object
    {
        return DB::transaction(function () use ($moduleId, $data, $tenantId) {
            $module = $this->moduleRepository->update($moduleId, $data);

            if (array_key_exists('permissions', $data)) {
                $existing = $this->permissionRepository
                    ->getPermissionByModuleId($moduleId)
                    ->pluck('name')
                    ->toArray();

                $newPermissions = $data['permissions'] ?? [];

                foreach (array_diff($newPermissions, $existing) as $permName) {
                    $this->permissionRepository->store([
                        'name'      => $permName,
                        'tenant_id' => $tenantId,
                        'module_id' => $moduleId,
                    ]);
                }

                $toDelete = array_diff($existing, $newPermissions);
                if (!empty($toDelete)) {
                    $this->permissionRepository->removePermissionsFromModule($moduleId, $toDelete);
                }
            }

            return $this->moduleRepository->findById($module->id);
        });
    }

    /** @throws Throwable */
    public function updatedModule(Request $request): object|array
    {
        return DB::transaction(function () use ($request) {
            $modules = $request->input('modules', []);

            $existingIds = collect($modules)
                ->filter(fn($m) => !str_starts_with($m['id'], 'new-'))
                ->pluck('id')
                ->toArray();

            $this->moduleRepository->deleteWhereNotIn($existingIds);

            $newModules      = array_filter($modules, fn($m) => str_starts_with($m['id'], 'new-'));
            $existingModules = array_filter($modules, fn($m) => !str_starts_with($m['id'], 'new-'));

            $this->moduleRepository->bulkCreate(array_values($newModules));
            $this->moduleRepository->bulkUpdate(array_values($existingModules));

            return $this->moduleRepository->getAllWithPermissions();
        });
    }

    /** @throws Throwable */
    public function destroy(string $moduleId): void
    {
        DB::transaction(function () use ($moduleId) {
            $module = $this->moduleRepository->findById($moduleId);
            $this->deleteModulePermissionsRecursively($module);
            $this->deleteModuleRecursively($module);
        });
    }

    private function deleteModulePermissionsRecursively(object $module): void
    {
        $permissions = PermissionModel::where('module_id', $module->id)->get();

        foreach ($permissions as $permission) {
            $permission->roles()->detach();
            $permission->delete();
        }

        foreach ($module->children as $child) {
            $this->deleteModulePermissionsRecursively($child);
        }
    }

    private function deleteModuleRecursively(object $module): void
    {
        foreach ($module->children as $child) {
            $this->deleteModuleRecursively($child);
        }

        $this->moduleRepository->delete($module->id);
    }
}
