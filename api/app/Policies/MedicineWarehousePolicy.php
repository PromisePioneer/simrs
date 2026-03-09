<?php

namespace App\Policies;

use App\Models\MedicineWarehouse;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MedicineWarehousePolicy
{

    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat Gudang Obat');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Membuat Gudang Obat');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah Gudang Obat');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus Gudang Obat');
    }
}
