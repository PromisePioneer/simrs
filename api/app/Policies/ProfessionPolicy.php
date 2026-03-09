<?php

namespace App\Policies;

use App\Models\User;

class ProfessionPolicy
{

    public function view(User $user): bool
    {
        if ($user->hasActiveRole('Owner')) {
            return true;
        }

        return $user->hasActivePermission(permission: "Melihat Profesi");
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: "Membuat Profesi");
    }


    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: "Mengubah Profesi");
    }


    public function destroy(User $user): bool
    {
        return $user->hasActivePermission(permission: "Menghapus Profesi");
    }
}
