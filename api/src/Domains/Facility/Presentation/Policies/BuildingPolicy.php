<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Policies;

use App\Models\User;

class BuildingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Gedung');
    }

    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Gedung');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Membuat Gedung');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Gedung');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Gedung');
    }
}
