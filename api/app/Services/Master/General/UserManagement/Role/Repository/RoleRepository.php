<?php

namespace App\Services\Master\General\UserManagement\Role\Repository;

use App\Models\Role as SpatieRole;
use App\Services\Master\General\UserManagement\Role\Interface\RoleInterface;
use Illuminate\Support\Str;

class RoleRepository implements RoleInterface
{
    private SpatieRole $model;

    public function __construct()
    {
        $this->model = new SpatieRole();
    }

    public function getRoles(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with('tenant')->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->with('tenant')->find($id);
    }

    public function store(array $data = []): object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data = []): object
    {
        $role = $this->model->findById($id);
        $role->fill($data);
        $role->save();
        return $role;
    }

    public function destroy(string $id): object
    {
        return $this->findById($id)->delete();
    }
}
