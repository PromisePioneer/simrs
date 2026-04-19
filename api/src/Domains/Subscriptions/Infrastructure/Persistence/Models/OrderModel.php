<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrderModel extends BaseModel
{
    protected $table = 'orders';

    protected $fillable = [
        'tenant_id',
        'plan_id',
        'order_number',
        'amount',
        'total',
        'status',
        'paid_at',
        'expires_at',
    ];

    protected $casts = [
        'amount'     => 'float',
        'total'      => 'float',
        'paid_at'    => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(PlanModel::class, 'plan_id');
    }

    public function payment(): HasOne
    {
        return $this->hasOne(SubscriptionPaymentModel::class, 'order_id');
    }
}
