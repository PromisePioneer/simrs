<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Policies;

use App\Models\User;

class SubSpecializationPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Sub Spesialisasi'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Sub Spesialisasi'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Membuat Sub Spesialisasi'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Sub Spesialisasi'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Sub Spesialisasi'); }
}
