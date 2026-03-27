<?php

declare(strict_types=1);

namespace Domains\Tenant\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Domains\Subscriptions\Infrastructure\Persistence\Models\SubscriptionModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TenantModel extends BaseModel
{
    use HasFactory;

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
        'pic_email',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function npwpProvince(): BelongsTo
    {
        return $this->belongsTo(
            \Domains\MasterData\Infrastructure\Persistent\Models\ProvinceModel::class,
            'npwp_province_id'
        );
    }

    public function npwpDistrict(): BelongsTo
    {
        return $this->belongsTo(
            \Domains\MasterData\Infrastructure\Persistent\Models\DistrictModel::class,
            'npwp_district_id'
        );
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(SubscriptionModel::class, 'tenant_id');
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(SubscriptionModel::class, 'tenant_id')
            ->where('status', 'active')
            ->latest();
    }

    // ── Business logic helpers ────────────────────────────────────────────────

    public function hasActiveSubscription(): bool
    {
        return $this->subscriptions()
            ->where('status', 'active')
            ->where('ends_at', '>', now())
            ->exists();
    }

    public function getCurrentPlan(): ?object
    {
        $subscription = $this->subscriptions()
            ->where('status', 'active')
            ->where('ends_at', '>', now())
            ->with('plan')
            ->latest()
            ->first();

        return $subscription?->plan;
    }

    public function canAccessModule(string $moduleId): bool
    {
        $plan = $this->getCurrentPlan();

        if (!$plan) {
            return false;
        }

        return $plan->modules()
            ->where('plan_module.module_id', $moduleId)
            ->where('plan_module.is_accessible', true)
            ->exists();
    }

    public function getAllowedPermissionsForModule(string $moduleId): ?array
    {
        $plan = $this->getCurrentPlan();

        if (!$plan) {
            return null;
        }

        $planModule = $plan->modules()
            ->where('plan_module.module_id', $moduleId)
            ->first();

        if (!$planModule) {
            return null;
        }

        return $planModule->pivot->allowed_permissions ?? null;
    }

    public function getModuleLimit(string $moduleId): ?int
    {
        $plan = $this->getCurrentPlan();

        if (!$plan) {
            return 0;
        }

        $planModule = $plan->modules()
            ->where('plan_module.module_id', $moduleId)
            ->first();

        return $planModule?->pivot->limit ?? null;
    }

    public function hasTenant(): bool
    {
        return !empty($this->id);
    }
}
