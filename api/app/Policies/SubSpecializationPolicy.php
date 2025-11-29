<?php

namespace App\Policies;

use App\Models\User;

class SubSpecializationPolicy
{

    public function view(User $user): bool
    {
        return $user->can("Melihat Sub Spesialisasi");
    }


    public function create(User $user): bool
    {
        return $user->can("Membuat Sub Spesialisasi");

    }

    public function update(User $user): bool
    {
        return $user->can("Mengubah Sub Spesialisasi");
    }


    public function delete(User $user): bool
    {
        return $user->can("Menghapus Sub Spesialisasi");
    }
}
