<?php

namespace App\Policies;

use App\Models\User;

class SubSpecializationPolicy
{

    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: "Melihat Sub Spesialisasi");
    }


    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: "Membuat Sub Spesialisasi");

    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: "Mengubah Sub Spesialisasi");
    }


    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission:"Menghapus Sub Spesialisasi");
    }
}
