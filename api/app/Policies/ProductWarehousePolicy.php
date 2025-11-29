<?php

namespace App\Policies;

use App\Models\ProductWarehouse;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductWarehousePolicy
{

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ProductWarehouse $productWarehouse): bool
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
    public function update(User $user, ProductWarehouse $productWarehouse): bool
    {
        return $user->can('Mengubah Gudang Produk');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProductWarehouse $productWarehouse): bool
    {
        return $user->can('Menghapus Gudang Produk');
    }
}
