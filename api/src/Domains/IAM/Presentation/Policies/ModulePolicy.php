<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Policies;

use App\Models\User;

class ModulePolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Module'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Module'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Module'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Module'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Module'); }
}
