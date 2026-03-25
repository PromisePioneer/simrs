<?php

declare(strict_types=1);

namespace Domains\MasterData\Persentation\Policies;

use App\Models\User;

class PaymentMethodTypePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Metode Pembayaran');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Metode Pembayaran');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Metode Pembayaran');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Metode Pembayaran');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Metode Pembayaran');
    }
}
