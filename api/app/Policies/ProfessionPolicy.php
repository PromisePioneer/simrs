<?php

namespace App\Policies;

use App\Models\User;

class ProfessionPolicy
{

    public function view(User $user): bool
    {
        if ($user->hasRole('Owner')) {
            return true;
        }

        return $user->can("Melihat Profesi");
    }

    public function create(User $user): bool
    {
        return $user->can("Membuat Profesi");
    }


    public function update(User $user): bool
    {
        return $user->can("Mengubah Profesi");
    }


    public function destroy(User $user): bool
    {
        return $user->can("Menghapus Profesi");
    }
}
