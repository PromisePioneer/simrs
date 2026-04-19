<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineUnitTypeModel extends BaseTenantModel
{
    use HasUuids;

    protected $table = 'product_unit_types';
    protected $fillable = ['tenant_id', 'code', 'name'];

    public function medicines(): HasMany
    {
        return $this->hasMany(MedicineModel::class, 'unit_type_id');
    }
}
