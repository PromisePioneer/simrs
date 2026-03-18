<?php

declare(strict_types=1);

namespace Domains\Facility\Infrastructure\Persistence\Models;

use App\Models\TenantScopeBaseModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BuildingModel extends TenantScopeBaseModel
{
    use HasUuids, SoftDeletes;

    protected $table = 'buildings';
    protected $fillable = [
        'tenant_id',
        'building_id',
        'department_id',
        'name',
        'description',
    ];

    public function wards(): HasMany
    {
        return $this->hasMany(WardModel::class, 'building_id');
    }
}
