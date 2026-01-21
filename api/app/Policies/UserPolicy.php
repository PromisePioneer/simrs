<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{


    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat User Management');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menambahkan User Management');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah User Management');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus User Management');
    }
}
