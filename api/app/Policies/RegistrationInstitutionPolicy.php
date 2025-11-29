<?php

namespace App\Policies;

use App\Models\User;

class RegistrationInstitutionPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user): bool
    {
        if ($user->hasRole('Owner')) {
            return true;
        }

        return $user->can('Melihat Lembaga Pendaftaran');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('Menambahkan Lembaga Pendaftaran');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user): bool
    {
        return $user->can('Mengubah Lembaga Pendaftaran');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user): bool
    {
        return $user->can('Menghapus Lembaga Pendaftaran');
    }
}
