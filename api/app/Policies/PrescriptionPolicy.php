<?php

namespace App\Policies;

use App\Models\User;

class PrescriptionPolicy
{

    public function view(User $user): bool
    {
        return $user->can('Melihat Penebusan Obat');
    }

    public function create(User $user): bool
    {
        return $user->can('Menambahkan Penebusan Obat');
    }


    public function update(User $user): bool
    {
        return $user->can('Mengubah Penebusan Obat');
    }


    public function delete(User $user): bool
    {
        return $user->can('Menghapus Penebusan Obat');
    }


}
