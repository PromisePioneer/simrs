<?php

namespace App\Policies;

use App\Models\User;

class RolePolicy
{
    public function view(User $user): bool
    {
        return $user->can('Melihat role');
    }

    public function create(User $user): bool
    {
        return $user->can('Menambahkan role');
    }

    public function update(User $user): bool
    {
        return $user->can('Mengubah role');
    }

    public function delete(User $user): bool
    {
        return $user->can('Menghapus role');
    }
}
