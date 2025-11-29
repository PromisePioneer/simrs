<?php

namespace App\Policies;

use App\Models\User;

class SpecializationPolicy
{
    public function view(User $user): bool
    {
        return $user->can("Melihat Spesialisasi");
    }


    public function create(User $user): bool
    {
        return $user->can("Membuat Spesialisasi");

    }

    public function update(User $user): bool
    {
        return $user->can("Mengubah Spesialisasi");
    }


    public function delete(User $user): bool
    {
        return $user->can("Menghapus Spesialisasi");
    }
}
