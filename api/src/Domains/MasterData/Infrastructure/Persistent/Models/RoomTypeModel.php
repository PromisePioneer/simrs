<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;

class RoomTypeModel extends BaseModel
{
    protected $table = 'room_types';
    protected $fillable = [
        'code',
        'name',
        'tenant_id',
        'description',
        'default_capacity'
    ];
}
