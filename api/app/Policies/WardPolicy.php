<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Ward;

class WardPolicy
{
    public function view(User $user)
    {
        return $user->can('Melihat Ruangan');
    }


    public function create(User $user)
    {
        return $user->can('Membuat Ruangan');
    }


    public function update(User $user)
    {
        return $user->can('Mengubah Ruangan');
    }


    public function destroy(User $user)
    {
        return $user->can('Menghapus Ruangan');
    }
}
