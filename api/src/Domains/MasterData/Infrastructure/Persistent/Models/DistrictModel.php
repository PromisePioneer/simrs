<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use App\Models\Regency;
use App\Models\Village;
use AzisHapidin\IndoRegion\Traits\DistrictTrait;
use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistrictModel extends BaseModel
{
    use DistrictTrait;

    /**
     * Table name.
     *
     * @var string
     */
    protected $table = 'districts';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'regency_id'
    ];

    /**
     * District belongs to Regency.
     *
     * @return BelongsTo
     */
    public function regency()
    {
        return $this->belongsTo(RegencyModel::class);
    }

    public function villages()
    {
        return $this->hasMany(VillageModel::class);
    }
}
