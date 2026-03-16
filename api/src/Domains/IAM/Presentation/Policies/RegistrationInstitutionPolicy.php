<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Policies;

use App\Models\User;

class RegistrationInstitutionPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Lembaga Pendaftaran'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Lembaga Pendaftaran'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Lembaga Pendaftaran'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Lembaga Pendaftaran'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Lembaga Pendaftaran'); }
}
