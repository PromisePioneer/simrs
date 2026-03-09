<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use App\Traits\Tenant\TenantManager;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineCategory extends TenantScopeBaseModel
{
    use HasUuids, HasFactory, TenantManager;

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


    public static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }
}
