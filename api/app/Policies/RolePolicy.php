<?php

namespace App\Policies;

use App\Models\User;

class RolePolicy
{
    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat Role');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menambahkan Role');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah Role');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus Role');
    }
}
