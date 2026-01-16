<?php

namespace App\Policies;

use App\Models\User;

class RegistrationInstitutionPolicy
{

    public function view(User $user): bool
    {
        if ($user->hasActiveRole('Owner')) {
            return true;
        }

        return $user->hasActivePermission(permission: 'Melihat Lembaga Pendaftaran');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menambahkan Lembaga Pendaftaran');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah Lembaga Pendaftaran');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus Lembaga Pendaftaran');
    }
}
