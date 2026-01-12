<?php

namespace App\Policies;

use App\Models\User;

class RolePolicy
{
    public function view(User $user): bool
    {
        return $user->can('Melihat Role');
    }

    public function create(User $user): bool
    {
        return $user->can('Menambahkan Role');
    }

    public function update(User $user): bool
    {
        return $user->can('Mengubah Role');
    }

    public function delete(User $user): bool
    {
        return $user->can('Menghapus Role');
    }
}
