<?php

declare(strict_types=1);

namespace Domains\Patient\Presentation\Policies;

use App\Models\User;

class PatientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Pasien');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Pasien');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Pasien');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Pasien');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Pasien');
    }
}
