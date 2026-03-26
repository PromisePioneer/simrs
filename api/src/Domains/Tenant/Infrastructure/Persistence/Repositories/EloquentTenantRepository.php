<?php

declare(strict_types=1);

namespace Domains\Tenant\Infrastructure\Persistence\Repositories;

use Domains\Tenant\Domain\Exceptions\TenantNotFoundException;
use Domains\Tenant\Domain\Repository\TenantRepositoryInterface;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentTenantRepository implements TenantRepositoryInterface
{
    public function __construct(
        private readonly TenantModel $model,
    ) {}

    public function getTenants(array $filters, ?int $perPage = null): Collection|LengthAwarePaginator
    {
        $query = $this->model
            ->with(['npwpProvince', 'npwpDistrict'])
            ->orderBy('name');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): object
    {
        $tenant = $this->model->find($id);

        if (!$tenant) {
            throw new TenantNotFoundException($id);
        }

        return $tenant;
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): object
    {
        $tenant = $this->findById($id);
        $tenant->fill($data);
        $tenant->save();

        return $tenant->fresh();
    }

    public function delete(string $id): void
    {
        $tenant = $this->findById($id);
        $tenant->delete();
    }
}
