<?php

namespace App\Services\Master\General\Modules\Interface;

interface ModuleRepositoryInterface
{
    public function getModules(string $roleName, object $user, array $userPermissions): ?object;
}
