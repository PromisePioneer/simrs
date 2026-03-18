<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SpecializationModel extends BaseModel
{
    protected $table    = 'specializations';
    protected $fillable = ['id', 'profession_id', 'name', 'description'];

    public function profession(): BelongsTo
    {
        return $this->belongsTo(ProfessionModel::class, 'profession_id');
    }

    public function subSpecializations(): HasMany
    {
        return $this->hasMany(SubSpecializationModel::class, 'specialization_id');
    }
}
