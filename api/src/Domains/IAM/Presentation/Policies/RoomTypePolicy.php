<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Policies;

use App\Models\User;

class RoomTypePolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Tipe Ruangan'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Tipe Ruangan'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Membuat Tipe Ruangan'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Tipe Ruangan'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Tipe Ruangan'); }
}
