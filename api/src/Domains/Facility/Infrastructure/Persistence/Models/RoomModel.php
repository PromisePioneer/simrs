<?php

declare(strict_types=1);

namespace Domains\Facility\Infrastructure\Persistence\Models;

use Domains\MasterData\Infrastructure\Persistent\Models\RoomTypeModel;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoomModel extends BaseTenantModel
{
    use HasUuids;

    protected $table = 'rooms';
    protected $fillable = [
        'tenant_id',
        'ward_id',
        'room_type_id',
        'room_number',
        'capacity',
        'name',
    ];

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomTypeModel::class, 'room_type_id');
    }

    public function beds(): HasMany
    {
        return $this->hasMany(BedModel::class, 'room_id');
    }

    public function ward(): BelongsTo
    {
        return $this->belongsTo(WardModel::class, 'ward_id');
    }
}
