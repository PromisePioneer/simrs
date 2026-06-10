<?php

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineSupplierModel extends BaseTenantModel
{
    protected $table = 'medicine_suppliers';
    protected $fillable = ['id', 'tenant_id', 'name', 'phone', 'address', 'is_active'];


    public function medicineBatches(): HasMany
    {
        return $this->hasMany(MedicineBatchModel::class, 'medicine_supplier_id');
    }
}
