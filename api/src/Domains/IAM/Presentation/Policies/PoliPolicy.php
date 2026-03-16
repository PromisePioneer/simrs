<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Policies;

use App\Models\User;

class PoliPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Poli'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Poli'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Poli'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Poli'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Poli'); }
}
