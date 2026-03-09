<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Tenant extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'tenants';
    protected $fillable = [
        'code',
        'name',
        'type',
        'nib',
        'sio',
        'npwp_full_name',
        'npwp_type',
        'nik_npwp',
        'npwp_number',
        'npwp_address',
        'npwp_province_id',
        'npwp_district_id',
        'ktp_full_name',
        'nik_ktp',
        'ktp_attachment',
        'pic_full_name',
        'pic_role',
        'pic_phone_number',
        'pic_email'
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class, 'tenant_id', 'id');
    }


    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function npwpProvince(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'npwp_province_id');
    }

    public function npwpDistrict(): BelongsTo
    {
        return $this->belongsTo(District::class, 'npwp_district_id');
    }


    /**
     * Check if tenant has active subscription
     */
    public function hasActiveSubscription(): bool
    {
        return $this->subscriptions()
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('ends_at')
                    ->orWhere('ends_at', '>=', now());
            })
            ->exists();
    }


    /**
     * Get current active plan
     */
    public function getCurrentPlan(): ?object
    {
        return $this->subscription?->plan;
    }


    /**
     * Check if tenant's plan allows access to module
     */
    public function canAccessModule($moduleId): bool
    {
        if (!$this->hasActiveSubscription()) {
            return false;
        }

        $plan = $this->getCurrentPlan();
        if (!$plan) {
            return false;
        }

        return $plan->modules()
            ->where('modules.id', $moduleId)
            ->where('plan_module.is_accessible', true)
            ->exists();
    }


}
