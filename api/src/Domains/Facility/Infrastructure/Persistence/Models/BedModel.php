<?php

declare(strict_types=1);

namespace Domains\Facility\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BedModel extends Model
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
        return $this->belongsTo(RoomModel::class, 'room_id');
    }

    public function bedAssignments(): HasMany
    {
        return $this->hasMany(\Domains\Inpatient\Infrastructure\Persistence\Models\BedAssignmentModel::class, 'bed_id');
    }
}
