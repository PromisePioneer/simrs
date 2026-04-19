<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionPaymentModel extends BaseModel
{
    protected $table = 'subscription_payments';

    protected $fillable = [
        'order_id',
        'tenant_id',
        'gateway',
        'gateway_transaction_id',
        'payment_url',
        'payment_type',
        'amount',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'amount'  => 'float',
        'paid_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(OrderModel::class, 'order_id');
    }
}
