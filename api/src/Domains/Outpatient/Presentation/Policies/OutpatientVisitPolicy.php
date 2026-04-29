<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Policies;

use App\Models\User;

class OutpatientVisitPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Rawat Jalan');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Rawat Jalan');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Rawat Jalan');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Rawat Jalan');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Rawat Jalan');
    }
}
