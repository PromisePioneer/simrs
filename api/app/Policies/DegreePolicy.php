<?php

namespace App\Policies;

use App\Models\Degree;
use App\Models\User;

class DegreePolicy
{
    public function view(User $user): bool
    {
        if ($user->hasActiveRole(role: 'Owner')) {
            return true;
        }

        return $user->hasActivePermission(permission: 'Melihat Gelar');

    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Membuat Gelar');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah Gelar');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus Gelar');
    }
}
