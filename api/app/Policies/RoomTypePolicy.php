<?php

namespace App\Policies;

use App\Models\User;

class RoomTypePolicy
{

    public function view(User $user): bool
    {
        return $user->can('Melihat Tipe Ruangan');
    }


    public function create(User $user): bool
    {
        return $user->can('Membuat Tipe Ruangan');
    }


    public function update(User $user): bool
    {
        return $user->can('Mengubah Tipe Ruangan');
    }


    public function delete(User $user): bool
    {
        return $user->can('Menghapus Tipe Ruangan');
    }
}
