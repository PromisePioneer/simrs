<?php

namespace App\Policies;

use App\Models\Degree;
use App\Models\User;

class DegreePolicy
{
    public function view(User $user): bool
    {
        if ($user->hasRole('Owner')) {
            return true;
        }

        return $user->can('Melihat Gelar');

    }

    public function create(User $user): bool
    {
        return $user->can('Membuat Gelar');
    }

    public function update(User $user): bool
    {
        return $user->can('Mengubah Gelar');
    }

    public function delete(User $user): bool
    {
        return $user->can('Menghapus Gelar');
    }
}
