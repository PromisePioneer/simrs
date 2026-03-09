<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ward extends TenantScopeBaseModel
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
        return $this->belongsTo(Building::class, 'building_id');
    }


    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
}
