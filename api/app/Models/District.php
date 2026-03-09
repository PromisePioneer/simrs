<?php

/*
 * This file is part of the IndoRegion package.
 *
 * (c) Azis Hapidin <azishapidin.com | azishapidin@gmail.com>
 *
 */

namespace App\Models;

use AzisHapidin\IndoRegion\Traits\DistrictTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use App\Models\Regency;
use App\Models\Village;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * District Model.
 */
class District extends Model
{
    use HasUuids, DistrictTrait;

    /**
     * Table name.
     *
     * @var string
     */
    protected $table = 'districts';

    public $timestamps = false;

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
    public function regency(): BelongsTo
    {
        return $this->belongsTo(Regency::class);
    }

    /**
     * District has many villages.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function villages()
    {
        return $this->hasMany(Village::class);
    }
}
