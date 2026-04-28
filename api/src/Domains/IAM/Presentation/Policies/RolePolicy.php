<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Policies;

use App\Models\User;

class RolePolicy
{
    public function view(User $user): bool
    {
        return $user->hasActivePermission('Melihat Role');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan Role');
    }

    public function update(User $user): bool
    {
        return $user->hasActivePermission('Mengubah Role');
    }

    public function delete(User $user): bool
    {
        return $user->hasActivePermission('Menghapus Role');
    }
}
