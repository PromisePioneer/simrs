<?php

declare(strict_types=1);

namespace Domains\MasterData\Persentation\Policies;

use App\Models\User;

class PaymentMethodPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Tipe Pembayaran');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Tipe Pembayaran');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Tipe Pembayaran');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Tipe Metode Pembayaran');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Tipe Metode Pembayaran');
    }
}
