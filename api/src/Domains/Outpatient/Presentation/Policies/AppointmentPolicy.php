<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AppointmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Janji Temu');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Janji Temu');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Janji Temu');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Janji Temu');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Janji Temu');
    }
}
