<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use App\Models\District;
use AzisHapidin\IndoRegion\Traits\VillageTrait;
use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VillageModel extends BaseModel
{
    use VillageTrait;

    protected $table = 'villages';

    protected $hidden = [
        'district_id'
    ];

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }
}
