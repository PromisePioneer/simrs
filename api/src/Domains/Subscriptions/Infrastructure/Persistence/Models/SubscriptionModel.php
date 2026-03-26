<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionModel extends BaseModel
{
    protected $table = 'subscriptions';

    protected $fillable = [
        'tenant_id',
        'plan_id',
        'status',
        'starts_at',
        'ends_at',
        'trial_ends_at',
        'cancelled_at',
    ];

    protected $casts = [
        'starts_at'     => 'datetime',
        'ends_at'       => 'datetime',
        'trial_ends_at' => 'datetime',
        'cancelled_at'  => 'datetime',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(PlanModel::class, 'plan_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(\Domains\Tenant\Infrastructure\Persistence\Models\TenantModel::class, 'tenant_id');
    }
}
