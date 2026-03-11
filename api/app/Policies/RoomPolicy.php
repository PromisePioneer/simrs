<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\User;

class RoomPolicy
{

    public function view(User $user): bool
    {
        return $user->can('Melihat Ruangan');
    }


    public function create(User $user): bool
    {
        return $user->can('Membuat Ruangan');
    }

    public function update(User $user): bool
    {
        return $user->can('Mengubah Ruangan');
    }

    public function delete(User $user): bool
    {
        return $user->can('Menghapus Ruangan');
    }

}
