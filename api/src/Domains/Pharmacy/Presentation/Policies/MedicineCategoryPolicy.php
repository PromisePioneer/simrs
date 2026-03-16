<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Policies;

use App\Models\User;

class MedicineCategoryPolicy
{
    public function viewAny(User $user): bool { return $user->hasActivePermission('Melihat Kategori Obat'); }
    public function view(User $user): bool    { return $user->hasActivePermission('Melihat Kategori Obat'); }
    public function create(User $user): bool  { return $user->hasActivePermission('Menambahkan Kategori Obat'); }
    public function update(User $user): bool  { return $user->hasActivePermission('Mengubah Kategori Obat'); }
    public function delete(User $user): bool  { return $user->hasActivePermission('Menghapus Kategori Obat'); }
}
