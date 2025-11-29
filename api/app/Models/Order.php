<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'orders';
    protected $fillable = [
        'tenant_id',
        'plan_id',
        'order_number',
        'amount',
        'tax',
        'total',
        'status',
        'paid_at',
        'expires_at',
    ];


    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }


    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'order_id');
    }
}
