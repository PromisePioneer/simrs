<?php

declare(strict_types=1);

namespace Domains\Facility\Infrastructure\Persistence\Models;

use App\Models\TenantScopeBaseModel;
use Domains\IAM\Infrastructure\Persistence\Models\DepartmentModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WardModel extends TenantScopeBaseModel
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
