<?php

declare(strict_types=1);

namespace Domains\MasterData\Persentation\Policies;

use App\Models\User;

class DepartmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Departemen');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Departemen');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Departemen');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Departemen');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Departemen');
    }
}
