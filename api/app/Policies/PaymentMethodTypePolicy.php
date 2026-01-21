<?php

namespace App\Policies;

use App\Models\PaymentMethodType;
use App\Models\User;

class PaymentMethodTypePolicy
{
    public function view(User $user): bool
    {
        return $user->hasActivePermission(permission: 'Melihat Metode Pembayaran');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission(permission: "Menambahkan Metode Pembayaran");
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission(permission: "Mengubah Metode Pembayaran");
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission(permission: "Menghapus Metode Pembayaran");
    }
}
