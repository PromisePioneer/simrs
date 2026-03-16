<?php

namespace Domains\IAM\Presentation\Policies;

use App\Models\User;

class PaymentMethodPolicy
{
    public function view(User $user)
    {
        return $user->hasActivePermission('Melihat Metode Pembayaran');
    }

    public function create(User $user)
    {
        return $user->hasActivePermission('Melihat Metode Pembayaran');
    }

    public function update(User $user)
    {
        return $user->hasActivePermission('Melihat Metode Pembayaran');
    }

    public function delete(User $user)
    {
        return $user->hasActivePermission('Melihat Metode Pembayaran');
    }
}
