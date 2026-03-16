<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Policies;

use App\Models\User;

class MedicineWarehousePolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Gudang Obat'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Gudang Obat'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Gudang Obat'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Gudang Obat'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Gudang Obat'); }
}
