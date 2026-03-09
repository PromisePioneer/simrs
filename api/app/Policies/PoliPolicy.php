<?php

namespace App\Policies;

use App\Models\Poli;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PoliPolicy
{
    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat poli');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menambahkan poli');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah poli');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus poli');
    }
}
