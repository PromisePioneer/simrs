<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Policies;

use App\Models\User;

class MedicineBatchStockPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Stok Batch Obat'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Stok Batch Obat'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Stok Batch Obat'); }
}
