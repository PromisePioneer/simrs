<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Policies;

use App\Models\User;

class MedicineUnitTypePolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Satuan Obat'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Satuan Obat'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Satuan Obat'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Satuan Obat'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Satuan Obat'); }
}
