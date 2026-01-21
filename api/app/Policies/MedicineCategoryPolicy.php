<?php

namespace App\Policies;

use App\Models\MedicineCategory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MedicineCategoryPolicy
{

    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat Kategori Obat');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menambah Kategori Obat');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah Kategori Obat');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus Kategori Obat');
    }
}
