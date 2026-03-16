<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Policies;

use App\Models\User;

class MedicineRackPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Rak Obat'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Rak Obat'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Rak Obat'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Rak Obat'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Rak Obat'); }
}
