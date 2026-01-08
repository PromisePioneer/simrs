<?php

namespace App\Policies;

use App\Models\MedicineWarehouse;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductWarehousePolicy
{

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MedicineWarehouse $productWarehouse): bool
    {
        return $user->can('Melihat Gudang Produk');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('Membuat Gudang Produk');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MedicineWarehouse $productWarehouse): bool
    {
        return $user->can('Mengubah Gudang Produk');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MedicineWarehouse $productWarehouse): bool
    {
        return $user->can('Menghapus Gudang Produk');
    }
}
