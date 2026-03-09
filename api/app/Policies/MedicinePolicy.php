<?php

namespace App\Policies;

use App\Models\Medicine;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MedicinePolicy
{

    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat Obat');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Membuat Obat');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Mengubah Obat');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Menghapus Obat');
    }
}
