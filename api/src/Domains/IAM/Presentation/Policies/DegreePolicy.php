<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Policies;

use App\Models\User;

class DegreePolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Gelar'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Gelar'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Gelar'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Gelar'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Gelar'); }
}
