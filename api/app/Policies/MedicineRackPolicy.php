<?php

namespace App\Policies;

use App\Models\MedicineRack;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MedicineRackPolicy
{

    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat Rak Obat');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Membuat Rak Obat');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah Rak Obat');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus Rak Obat');
    }
}
