<?php

declare(strict_types=1);

namespace Domains\Inpatient\Presentation\Policies;

use App\Models\User;

class InpatientAdmissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Rawat Inap');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Rawat Inap');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Membuat Rawat Inap');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Rawat Inap');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Rawat Inap');
    }
}
