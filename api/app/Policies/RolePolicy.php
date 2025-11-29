<?php

namespace App\Policies;

use App\Models\User;

class RolePolicy
{

    public function view(User $user): bool
    {
        return $user->can('Melihat Role Management');
    }

    public function create(User $user): bool
    {
        return $user->can('Menambahkan Role Management');
    }

    public function update(User $user): bool
    {
        return $user->can('Mengubah Role Management');
    }

    public function delete(User $user): bool
    {
        return $user->can('Menghapus Role Management');
    }
}
