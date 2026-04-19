<?php

declare(strict_types=1);

namespace Domains\Inpatient\Presentation\Policies;

use App\Models\User;

class InpatientPrescriptionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Resep Rawat Inap');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Resep Rawat Inap');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Membuat Resep Rawat Inap');
    }

    public function dispense(User $user): bool
    {
        return $user->hasActivePermission('Dispensing Resep Rawat Inap');
    }

    public function cancel(User $user): bool
    {
        return $user->hasActivePermission('Membatalkan Resep Rawat Inap');
    }
}
