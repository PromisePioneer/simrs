<?php

namespace Domains\IAM\Presentation\Policies;

use App\Models\User;

class DepartmentPolicy
{
    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: "Melihat Departemen");
    }


    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: "Membuat Departemen");
    }


    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: "Mengubah Departemen");
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: "Menghapus Departemen");
    }
}
