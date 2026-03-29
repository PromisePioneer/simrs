<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use App\Models\Regency;
use AzisHapidin\IndoRegion\Traits\ProvinceTrait;
use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;

class ProvinceModel extends BaseModel
{
    use ProvinceTrait;

    protected $table = 'provinces';

    public function regencies()
    {
        return $this->hasMany(RegencyModel::class);
    }
}
