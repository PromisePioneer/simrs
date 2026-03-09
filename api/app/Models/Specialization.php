<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Specialization extends Model
{

    use HasUuids;

    protected $table = 'specializations';

    protected $fillable = [
        'profession_id',
        'name',
        'description',
    ];


    public function profession(): BelongsTo
    {
        return $this->belongsTo(Profession::class, 'profession_id');
    }


    public function subSpecializations(): HasMany
    {
        return $this->hasMany(SubSpecialization::class, 'specialization_id');
    }
}
