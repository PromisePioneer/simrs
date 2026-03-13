<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bed extends Model
{

    use HasUuids;

    protected $table = 'beds';
    protected $fillable = [
        'bed_number',
        'room_id',
        'status',
    ];


    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }


    public function bedAssignments(): HasMany
    {
        return $this->hasMany(BedAssignment::class, 'bed_id');
    }
}
