<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanModel extends BaseModel
{
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
        'price'     => 'float',
        'max_users' => 'integer',
        'is_active' => 'boolean',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(SubscriptionModel::class, 'plan_id');
    }

    public function modules(): BelongsToMany
    {
        // pivot table: plan_modules
        return $this->belongsToMany(
            \Domains\IAM\Infrastructure\Persistence\Models\ModuleModel::class,
            'plan_modules',
            'plan_id',
            'module_id'
        );
    }
}
