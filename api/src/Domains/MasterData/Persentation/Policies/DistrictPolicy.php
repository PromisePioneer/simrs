<?php

namespace Domains\MasterData\Persentation\Policies;

use App\Models\User;

class DistrictPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Kecamatan');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Kecamatan');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Kecamatan');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Kecamatan');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Kecamatan');
    }
}
