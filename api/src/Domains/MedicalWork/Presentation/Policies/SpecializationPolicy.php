<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Policies;

use App\Models\User;

class SpecializationPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Spesialisasi'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Spesialisasi'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Membuat Spesialisasi'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Spesialisasi'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Spesialisasi'); }
}
