<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Policies;

use App\Models\User;

class PermissionPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Permission'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Permission'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Permission'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Permission'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Permission'); }
}
