<?php

namespace Domains\MasterData\Persentation\Policies;

use App\Models\User;

class VillagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Kelurahan');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Kelurahan');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Kelurahan');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Kelurahan');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Kelurahan');
    }
}
