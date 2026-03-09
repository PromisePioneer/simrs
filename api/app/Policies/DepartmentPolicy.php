<?php

namespace App\Policies;

use App\Models\User;

class DepartmentPolicy
{
    public function view(User $user): bool
    {
        return $user->can("Melihat Departemen");
    }


    public function create(User $user): bool
    {
        return $user->can("Membuat Departemen");
    }


    public function update(User $user): bool
    {
        return $user->can("Mengubah Departemen");
    }

    public function delete(User $user): bool
    {
        return $user->can("Menghapus Departemen");
    }

}
