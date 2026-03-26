<?php

declare(strict_types=1);

namespace Domains\Facility\Infrastructure\Persistence\Models;

use Domains\MasterData\Infrastructure\Persistent\Models\DepartmentModel;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WardModel extends BaseTenantModel
{
    use HasUuids;

    protected $table = 'wards';
    protected $fillable = [
        'building_id',
        'department_id',
        'name',
        'floor',
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(BuildingModel::class, 'building_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(DepartmentModel::class, 'department_id');
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(RoomModel::class, 'ward_id');
    }
}
