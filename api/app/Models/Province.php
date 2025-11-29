<?php

/*
 * This file is part of the IndoRegion package.
 *
 * (c) Azis Hapidin <azishapidin.com | azishapidin@gmail.com>
 *
 */

namespace App\Models;

use AzisHapidin\IndoRegion\Traits\ProvinceTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Province Model.
 */
class Province extends Model
{
    use HasUuids, ProvinceTrait;

    /**
     * Table name.
     *
     * @var string
     */
    protected $table = 'provinces';
    public $timestamps = false;

    /**
     * Province has many regencies.
     *
     * @return HasMany
     */
    public function regencies(): HasMany
    {
        return $this->hasMany(Regency::class);
    }
}
