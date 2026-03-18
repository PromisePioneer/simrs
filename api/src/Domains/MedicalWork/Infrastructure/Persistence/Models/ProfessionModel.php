<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfessionModel extends BaseModel
{
    protected $table    = 'professions';
    protected $fillable = ['id', 'name', 'description'];

    public function specializations(): HasMany
    {
        return $this->hasMany(SpecializationModel::class, 'profession_id');
    }
}
