<?php

namespace App\Policies;

use App\Models\ProductRack;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductRackPolicy
{

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ProductRack $productRack): bool
    {
        return $user->can('Melihat Rak Produk');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('Membuat Rak Produk');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProductRack $productRack): bool
    {
        return $user->can('Mengubah Rak Produk');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProductRack $productRack): bool
    {
        return $user->can('Menghapus Rak Produk');
    }
}
