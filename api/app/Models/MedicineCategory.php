<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineCategory extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'medicine_categories';
    protected $fillable = [
        'tenant_id',
        'name',
        'type'
    ];

    public function medicine(): HasMany
    {
        return $this->hasMany(Medicine::class, 'category_id');
    }
}
