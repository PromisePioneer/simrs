<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use App\Models\Scopes\TenantScope;
use App\Models\TenantScopeBaseModel;
use App\Traits\Tenant\TenantManager;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineCategoryModel extends TenantScopeBaseModel
{
    use HasUuids, HasFactory, TenantManager;

    protected $table = 'medicine_categories';
    protected $fillable = ['tenant_id', 'name', 'type'];

    public function medicines(): HasMany
    {
        return $this->hasMany(MedicineModel::class, 'category_id');
    }

    public static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }
}
