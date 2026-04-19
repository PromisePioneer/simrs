<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Policies;

use App\Models\User;

class BedPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Tempat Tidur'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Tempat Tidur'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Membuat Tempat Tidur'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Tempat Tidur'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Tempat Tidur'); }
}
