<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Policies;

use App\Models\User;

class MedicineBatchPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Batch Obat'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Batch Obat'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Batch Obat'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Batch Obat'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Batch Obat'); }
}
