<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubSpecializationModel extends BaseModel
{
    protected $table    = 'sub_specializations';
    protected $fillable = ['id', 'specialization_id', 'name', 'description'];

    public function specialization(): BelongsTo
    {
        return $this->belongsTo(SpecializationModel::class, 'specialization_id');
    }
}
