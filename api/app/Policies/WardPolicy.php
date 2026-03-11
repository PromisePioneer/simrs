<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Ward;

class WardPolicy
{
    public function view(User $user)
    {
        return $user->can('Melihat Ruang Rawat');
    }


    public function create(User $user)
    {
        return $user->can('Membuat Ruang Rawat');
    }


    public function update(User $user)
    {
        return $user->can('Mengubah Ruang Rawat');
    }


    public function destroy(User $user)
    {
        return $user->can('Menghapus Ruang Rawat');
    }
}
