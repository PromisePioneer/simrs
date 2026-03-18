<?php

declare(strict_types=1);

namespace Domains\Clinical\Presentation\Policies;

use App\Models\User;

class PrescriptionPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Penebusan Obat'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Penebusan Obat'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Penebusan Obat'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Penebusan Obat'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Penebusan Obat'); }
}
