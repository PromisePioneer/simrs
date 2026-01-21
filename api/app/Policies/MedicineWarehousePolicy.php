<?php

namespace App\Policies;

use App\Models\MedicineWarehouse;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MedicineWarehousePolicy
{

    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat Gudang Produk');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Membuat Gudang Produk');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah Gudang Produk');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus Gudang Produk');
    }
}
