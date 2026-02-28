<?php

namespace App\Policies;

use App\Models\MedicineStockMovement;
use App\Models\User;

class MedicineStockMovementPolicy
{

    public function view(User $user): bool
    {
        return $user->can('Melihat Mutasi Stock');
    }
}
