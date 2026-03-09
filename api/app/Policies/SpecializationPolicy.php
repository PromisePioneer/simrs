<?php

namespace App\Policies;

use App\Models\User;

class SpecializationPolicy
{
    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: "Melihat Spesialisasi");
    }


    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: "Membuat Spesialisasi");

    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: "Mengubah Spesialisasi");
    }


    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: "Menghapus Spesialisasi");
    }
}
