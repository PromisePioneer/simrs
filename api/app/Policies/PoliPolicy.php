<?php

namespace App\Policies;

use App\Models\Poli;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PoliPolicy
{

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Poli $poli): bool
    {
        return $user->can('Melihat poli');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('Menambahkan poli');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Poli $poli): bool
    {
        return $user->can('Mengubah poli');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Poli $poli): bool
    {
        return $user->can('Menghapus poli');
    }
}
