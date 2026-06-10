<?php

namespace Domains\Pharmacy\Presentation\Policies;

use App\Models\User;

class MedicineSupplierPolicy
{
    public function view(User $user): bool
    {
        return $user->can('Melihat Supplier Obat');
    }

    public function create(User $user): bool
    {
        return $user->can("Membuat Supplier Obat");
    }


    public function update(User $user): bool
    {
        return $user->can('Mengubah Supplier Obat');
    }


    public function delete(User $user): bool
    {
        return $user->can('Menghapus Supplier Obat');
    }

}
