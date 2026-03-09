<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubSpecialization extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'sub_specializations';
    protected $fillable = [
        'specialization_id',
        'name',
        'description'
    ];


    public function specialization(): BelongsTo
    {
        return $this->belongsTo(Specialization::class, 'specialization_id');
    }
}
