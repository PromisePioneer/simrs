<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use App\Traits\Tenant\TenantManager;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Domains\Tenant\Infrastructure\Persistence\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineCategoryModel extends BaseTenantModel
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
