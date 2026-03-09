<?php

namespace App\Policies;

use App\Models\OutpatientVisit;
use App\Models\User;

class OutpatientVisitPolicy
{
    public function view(User $user): bool
    {
        return $user->can('Melihat Rawat Jalan');
    }

    public function create(User $user): bool
    {
        return $user->can('Membuat Rawat Jalan');
    }

    public function update(User $user): bool
    {
        return $user->can('Mengubah Rawat Jalan');
    }

    public function delete(User $user): bool
    {
        return $user->can('Menghapus Rawat Jalan');
    }
}
