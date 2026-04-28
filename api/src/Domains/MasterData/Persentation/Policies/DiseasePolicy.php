<?php

namespace Domains\MasterData\Persentation\Policies;

use App\Models\User;

class DiseasePolicy
{

    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Penyakit');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Penyakit');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Penyakit');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Penyakit');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Penyakit');
    }

}
