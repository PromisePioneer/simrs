<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{

    use HasUuids;

    protected $table = 'plans';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'billing_period',
        'max_users',
        'is_active',
    ];


    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'plan_module')
            ->withPivot('is_accessible', 'limit');
    }
}
