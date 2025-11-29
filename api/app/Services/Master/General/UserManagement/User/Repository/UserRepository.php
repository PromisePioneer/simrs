<?php

namespace App\Services\Master\General\UserManagement\User\Repository;

use App\Models\User;
use App\Services\Master\General\UserManagement\User\Interface\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository implements UserRepositoryInterface
{

    protected User $user;

    public function __construct()
    {
        $this->user = new User();
    }


    public function getAll(
        array $filters = [],
        ?int  $perPage = null
    ): Collection|LengthAwarePaginator
    {
        $query = User::query();

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->sameTenant()->paginate($perPage);
        }

        return $query->sameTenant()->get();
    }

    public function findById(string $id): ?User
    {
        $user = $this->user->with(['permissions'])->findOrFail($id);
        if ($user->roles()->count() === 1) {
            $user->roles = $user->roles->first();
        }


        return $user;
    }


    public function search(Builder $query, $keyword): void
    {
        $query->where('name', 'LIKE', '%' . $keyword . '%');
    }


    public static function store(array $data = []): object
    {
        return User::create($data);
    }


    public function update(string $id, array $data = []): object
    {
        $user = $this->user->findOrFail($id);
        $user->fill($data);
        $user->save();

        return $user->fresh();
    }

    public function destroy(string $id): object
    {
        $user = $this->user->findOrFail($id);
        $user->delete();
        return $user;
    }
}
