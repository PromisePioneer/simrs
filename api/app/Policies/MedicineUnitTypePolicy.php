<?php

namespace App\Policies;

use App\Models\ProductUnitType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MedicineUnitTypePolicy
{

    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat Satuan Obat');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menambahkan Satuan Obat');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah Satuan Obat');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus Satuan Obat');
    }
}
