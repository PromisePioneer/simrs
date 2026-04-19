<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Policies;

use App\Models\User;

class MedicinePolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Obat'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Obat'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Obat'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Obat'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Obat'); }
}
