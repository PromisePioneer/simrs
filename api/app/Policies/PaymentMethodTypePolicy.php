<?php

namespace App\Policies;

use App\Models\PaymentMethodType;
use App\Models\User;

class PaymentMethodTypePolicy
{
    public function view(User $user): bool
    {
        return $user->can('Melihat Metode Pembayaran');
    }

    public function create(User $user): bool
    {
        return $user->can("Menambahkan Metode Pembayaran");
    }

    public function update(User $user): bool
    {
        return $user->can("Mengubah Metode Pembayaran");
    }

    public function delete(User $user): bool
    {
        return $user->can("Menghapus Metode Pembayaran");
    }
}
