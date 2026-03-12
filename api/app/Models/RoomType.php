<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoomType extends TenantScopeBaseModel
{

    use HasUuids;

    protected $table = 'room_types';
    protected $fillable = [
        'code',
        'name',
        'description',
        'default_capacity'
    ];


    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'room_type_id', 'id');
    }


}
