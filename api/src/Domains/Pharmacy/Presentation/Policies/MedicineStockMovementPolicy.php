<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Policies;

use App\Models\User;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineStockMovementModel;

class MedicineStockMovementPolicy
{
    public function view(User $user, MedicineStockMovementModel $model): bool
    {
        return $user->hasActivePermission('Melihat Mutasi Stock');
    }

    public function viewAny(User $user): bool
    {
        return $user->hasActivePermission('Melihat Mutasi Stock');
    }
}
