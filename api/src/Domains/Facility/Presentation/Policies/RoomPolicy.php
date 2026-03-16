<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Policies;

use App\Models\User;

class RoomPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Ruangan'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Ruangan'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Membuat Ruangan'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Ruangan'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Ruangan'); }
}
