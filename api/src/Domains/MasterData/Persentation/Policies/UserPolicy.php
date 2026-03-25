<?php

declare(strict_types=1);

namespace Domains\MasterData\Persentation\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat User Management');
    }

    public function view(User $user, User $target): bool
    {
        return $user->hasActivePermission('Melihat User Management');
    }

    public function create(User $user): bool
    {
        return $user->hasActivePermission('Menambahkan User Management');
    }

    public function update(User $user, User $target): bool
    {
        return $user->hasActivePermission('Mengubah User Management');
    }

    public function delete(User $user, User $target): bool
    {
        if ($user->id === $target->id) return false;
        return $user->hasActivePermission('Menghapus User Management');
    }
}
