<?php

namespace App\Services\Master\General\Tenant\Repository;

use App\Models\Tenant;
use App\Services\Master\General\Tenant\Interface\TenantRepositoryInterface;

class TenantRepository implements TenantRepositoryInterface
{
    private Tenant $model;

    public function __construct()
    {
        $this->model = new Tenant();
    }

    public function getTenants(array $filters, ?int $perPage = null): object
    {
        $query = $this->model->with(['npwpProvince', 'npwpDistrict'])->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('code', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->findOrFail($id);
    }


    public function store(array $data = [])
    {
        return $this->model->create($data);
    }


    public function update(string $id, array $data = []): object
    {
        $tenant = $this->findById($id);
        $tenant->fill($data);
        $tenant->save();
        return $tenant->fresh();
    }
}
