<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineWarehouseModel extends BaseTenantModel
{
    use HasUuids, HasFactory;

    protected $table = 'medicine_warehouses';
    protected $fillable = ['tenant_id', 'code', 'name'];

    public function racks(): HasMany
    {
        return $this->hasMany(MedicineRackModel::class, 'warehouse_id');
    }
}
