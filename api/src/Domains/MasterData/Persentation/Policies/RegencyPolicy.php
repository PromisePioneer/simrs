<?php

namespace Domains\MasterData\Persentation\Policies;

use App\Models\User;

class RegencyPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Kabupaten');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Kabupaten');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Kabupaten');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Kabupaten');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Kabupaten');
    }
}
