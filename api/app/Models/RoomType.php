<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

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


}
