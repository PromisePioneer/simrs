<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicineRackModel extends BaseTenantModel
{
    use HasUuids;

    protected $table = 'medicine_racks';
    protected $fillable = ['tenant_id', 'warehouse_id', 'code', 'name'];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(MedicineWarehouseModel::class, 'warehouse_id');
    }
}
