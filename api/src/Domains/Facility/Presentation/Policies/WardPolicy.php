<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Policies;

use App\Models\User;

class WardPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Ruang Rawat'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Ruang Rawat'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Membuat Ruang Rawat'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Ruang Rawat'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Ruang Rawat'); }
}
