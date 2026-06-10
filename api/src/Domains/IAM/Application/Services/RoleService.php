<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Services;

use Domains\IAM\Domain\Repository\RoleRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class RoleService extends BaseCrudService
{
    public function __construct(RoleRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }


    public function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }


    public function getByTenant(string $tenantId): Collection
    {
        return $this->repository->getByTenant($tenantId);
    }

    public function update(string $id, array $data): object
    {
        $record = $this->repository->findById($id);
        
        // Extract permissions from data
        $permissions = $data['permissions'] ?? [];
        unset($data['permissions']);
        
        // Update role attributes
        $record->update($data);
        
        // Sync permissions if provided
        if (!empty($permissions)) {
            $record->syncPermissions($permissions);
        }
        
        return $record->fresh();
    }
}
