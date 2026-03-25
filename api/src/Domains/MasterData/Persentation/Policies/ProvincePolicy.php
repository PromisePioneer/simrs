<?php

namespace Domains\MasterData\Persentation\Policies;

use App\Models\User;

class ProvincePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Provinsi');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Provinsi');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Provinsi');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Provinsi');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Provinsi');
    }
}
