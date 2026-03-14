<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionPayment extends Model
{
    use HasUuids;

    protected $table = 'cashier';
    protected $fillable = [
        'order_id',
        'gateway_transaction_id',
        'payment_type',
        'amount',
        'status',
        'payment_url',
        'gateway_response',
    ];


    protected $casts = [
        'gateway_response' => 'json',
        'paid_at' => 'datetime',
    ];


    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
