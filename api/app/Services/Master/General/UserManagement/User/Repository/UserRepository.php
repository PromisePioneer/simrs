<?php

namespace App\Services\Master\General\UserManagement\User\Repository;

use App\Models\User;
use App\Services\Master\General\UserManagement\User\Interface\UserRepositoryInterface;
use App\Services\Tenant\TenantContext;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UserRepository implements UserRepositoryInterface
{

    protected User $model;

    public function __construct()
    {
        $this->model = new User();
    }


    public function getAll(
        array $filters = [],
        ?int  $perPage = null
    ): Collection|LengthAwarePaginator
    {
        $query = $this->model->query()->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where(DB::raw('LOWER(name)'), 'like', '%' . strtolower($filters['search']) . '%')
                ->orWhere(DB::raw('LOWER(email)'), 'like', '%' . strtolower($filters['search']) . '%');
        }

        if ($perPage) {
            return $query->sameTenant()->paginate($perPage);
        }

        return $query->sameTenant()->get();
    }

    public function findById(string $id): ?User
    {
        $user = $this->model->with(['permissions'])->findOrFail($id);
        if ($user->roles()->count() === 1) {
            $user->roles = $user->roles->first();
        }


        return $user;
    }


    public function search(object $query, string $keyword): void
    {
        $query->where('name', 'LIKE', '%' . $keyword . '%');
    }


    public static function store(array $data = []): object
    {
        return User::create($data);
    }


    public function update(string $id, array $data = []): object
    {
        $user = $this->model->findOrFail($id);
        $user->fill($data);
        $user->save();

        return $user->fresh();
    }

    public function destroy(string $id): object
    {
        $user = $this->model->findOrFail($id);
        $user->delete();
        return $user;
    }
}
