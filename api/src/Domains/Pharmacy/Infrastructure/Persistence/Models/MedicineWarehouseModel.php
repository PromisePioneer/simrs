<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use App\Models\TenantScopeBaseModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineWarehouseModel extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'medicine_warehouses';
    protected $fillable = ['tenant_id', 'code', 'name'];

    public function racks(): HasMany
    {
        return $this->hasMany(MedicineRackModel::class, 'warehouse_id');
    }
}
