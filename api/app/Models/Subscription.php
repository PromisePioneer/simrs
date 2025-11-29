<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'subscriptions';
    protected $fillable = [
        'tenant_id',
        'plan_id',
        'status',
        'trial_ends_at',
        'starts_at',
        'cancelled_at',
        'ends_at'
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }


    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active'
            && (is_null($this->ends_at) || $this->ends_at->isFuture());
    }

    public function isOnTrial(): bool
    {
        return $this->status === 'trialing'
            && $this->trial_ends_at
            && $this->trial_ends_at->isFuture();
    }

    public function cancel(): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);
    }
}
