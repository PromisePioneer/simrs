<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use App\Models\District;
use App\Models\Province;
use AzisHapidin\IndoRegion\Traits\RegencyTrait;
use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RegencyModel extends BaseModel
{
    use RegencyTrait;

    protected $table = 'regencies';

    protected $hidden = [
        'province_id'
    ];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }
}
