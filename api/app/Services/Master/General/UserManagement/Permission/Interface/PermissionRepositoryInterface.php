<?php

namespace App\Services\Master\General\UserManagement\Permission\Interface;
interface PermissionRepositoryInterface
{
    public function getPermissions(array $filters = [], ?int $perPage = null): object;


    public function findById(string $id): object;


    public function store(array $data = []): object;

    public function update(string $id, array $data = []): object;


    public function destroy(string $id): object;


    public static function getPermissionsByUser(object $user): array;

    public function getPermissionByModuleId(string $moduleId): ?object;

    public function removePermissionsFromModule(string $moduleId, array $permissionName): bool;
}
