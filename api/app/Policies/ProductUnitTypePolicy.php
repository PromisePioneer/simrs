<?php

namespace App\Policies;

use App\Models\ProductUnitType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductUnitTypePolicy
{

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user): bool
    {
        return $user->can('Melihat Satuan Produk');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('Menambahkan Satuan Produk');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user): bool
    {
        return $user->can('Mengubah Satuan Produk');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user): bool
    {
        return $user->can('Menghapus Satuan Produk');
    }
}
