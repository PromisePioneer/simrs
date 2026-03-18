<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Policies;

use App\Models\User;

class ProfessionPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Profesi'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Profesi'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Membuat Profesi'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Profesi'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Profesi'); }
}
