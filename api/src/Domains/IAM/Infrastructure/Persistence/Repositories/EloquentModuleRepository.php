<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use Domains\IAM\Domain\Repository\ModuleRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\ModuleModel;
use Illuminate\Support\Collection;

class EloquentModuleRepository implements ModuleRepositoryInterface
{
    public function __construct(private ModuleModel $model) {}

    public function getModules(?string $roleName, object $user, array $userPermissions): Collection
    {
        return match ($roleName) {
            'Super Admin' => $this->model
                ->whereNull('parent_id')
                ->orderBy('order')
                ->with(['permissions', 'childrenRecursive.permissions'])
                ->get(),

            default => $this->model
                ->whereNull('parent_id')
                ->orderBy('order')
                ->with(['childrenRecursive' => fn($q) => $q->orderBy('order'), 'permissions', 'childrenRecursive.permissions'])
                ->get(['id', 'name', 'route', 'parent_id', 'icon', 'order']),
        };
    }

    public function getPaginated(array $filters = [], int $perPage = 20): object
    {
        $query = $this->model
            ->with(['childrenRecursive', 'permissions'])
            ->whereNull('parent_id');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query->orderBy('order')->paginate($perPage);
    }

    public function findById(string $id): object
    {
        return $this->model->with('permissions')->findOrFail($id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): object
    {
        $module = $this->model->findOrFail($id);
        $module->update($data);
        return $module->fresh();
    }

    public function delete(string $id): void
    {
        $this->model->findOrFail($id)->delete();
    }

    public function deleteWhereNotIn(array $ids): void
    {
        $this->model->whereNotIn('id', $ids)->delete();
    }

    public function bulkCreate(array $items): void
    {
        foreach ($items as $item) {
            $this->model->create([
                'name'      => $item['name'],
                'route'     => $item['route'] ?? null,
                'parent_id' => $item['parent_id'] ?? null,
                'icon'      => $item['icon'] ?? null,
                'order'     => $item['order'] ?? 0,
            ]);
        }
    }

    public function bulkUpdate(array $items): void
    {
        foreach ($items as $item) {
            $this->model->where('id', $item['id'])->update([
                'name'      => $item['name'],
                'route'     => $item['route'] ?? null,
                'parent_id' => $item['parent_id'] ?? null,
                'icon'      => $item['icon'] ?? null,
                'order'     => $item['order'] ?? 0,
            ]);
        }
    }

    public function getAllWithPermissions(): Collection
    {
        return $this->model
            ->with(['permissions', 'childrenRecursive.permissions'])
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();
    }
}
