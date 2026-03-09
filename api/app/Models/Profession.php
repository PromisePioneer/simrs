<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profession extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'professions';
    protected $fillable = [
        'name',
        'description',
    ];


    public function specializations(): HasMany
    {
        return $this->hasMany(Specialization::class, 'profession_id');
    }
}
