<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends TenantScopeBaseModel
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
        return $this->belongsTo(RoomType::class, 'room_type_id', 'id');
    }


    public function beds(): HasMany
    {
        return $this->hasMany(Bed::class, 'room_id', 'id');
    }


    public function ward(): BelongsTo
    {
        return $this->belongsTo(Ward::class, 'ward_id');
    }
}
