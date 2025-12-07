<?php

namespace App\Models;

use App\Notifications\VerifyEmail;
use App\Services\Master\General\UserManagement\Permission\Repository\PermissionRepository;
use App\Traits\Tenant\TenantManager;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, TenantManager, HasRoles, HasUuids;


    public $incrementing = false;
    protected $keyType = 'string';
    protected string $guard_name = 'sanctum';

    protected $appends = ['full_name_with_degrees'];
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'str_institution_id',
        'str_registration_number',
        'str_active_period',
        'sip_institution_id',
        'sip_registration_number',
        'sip_active_period',
        'phone',
        'address',
        'signature',
        'tenant_id',
        'profile_picture',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmail());
    }


    public function scopeSameTenant($query): Builder
    {
        if (auth()->check()) {
            $user = auth()->user();

            if (!$user->tenant_id) {
                app(PermissionRegistrar::class)->setPermissionsTeamId(null);

                return $query->with(['roles', 'prefixes', 'suffixes']);
            }

            $query->where('tenant_id', $user->tenant_id);
        }

        return $query->with(['roles', 'prefixes', 'suffixes']);
    }


    public function getBackDegreeNameAttribute(): array
    {
        $backDegreeIds = $this->back_degrees;

        // decode if JSON string
        if (is_string($backDegreeIds)) {
            $backDegreeIds = json_decode($backDegreeIds, true);
        }

        if (empty($backDegreeIds)) {
            return [];
        }

        return Role::whereIn('id', $backDegreeIds)->pluck('name')->toArray();
    }


    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }

    public function doctorProfile(): HasOne
    {
        return $this->hasOne(DoctorProfile::class);
    }


    public function doctorSchedule(): HasOne
    {
        return $this->hasOne(DoctorSchedule::class);
    }


    public function degrees(): BelongsToMany
    {
        return $this->belongsToMany(Degree::class, 'user_degrees')
            ->withPivot('order')
            ->withTimestamps();
    }


    public function prefixes(): BelongsToMany
    {
        return $this->degrees()->where('degrees.type', 'prefix');
    }

    public function suffixes(): BelongsToMany
    {
        return $this->degrees()->where('degrees.type', 'suffix');
    }


    public function str(): HasOne
    {
        return $this->hasOne(RegistrationInstitution::class, 'id', 'str_institution_id');
    }


    public function sip(): HasOne
    {
        return $this->hasOne(RegistrationInstitution::class, 'id', 'sip_institution_id');
    }

    public function getFullNameWithDegreesAttribute(): string
    {
        $prefix = $this->prefixes->pluck('name')->join(' ');
        $suffix = $this->suffixes->pluck('name')->join(', ');

        return trim(($prefix ? $prefix . ' ' : '') . $this->name . ($suffix ? ', ' . $suffix : ''));
    }



    // ==================== SUBSCRIPTION METHODS ====================


    /**
     * Check if user's tenant has active subscription
     */
    public function hasActiveSubscription(): bool
    {
        // Super Admin bypass
        if ($this->hasRole('Super Admin')) {
            return true;
        }

        if (!$this->tenant) {
            return false;
        }

        return $this->tenant->hasActiveSubscription();
    }


    /**
     * Check if user can access module (based on tenant's plan + user's permission)
     */
    public function canAccessModule($moduleId): bool
    {
        if ($this->hasRole('Super Admin')) {
            return true;
        }

        if (!$this->tenant || !$this->tenant->canAccessModule($moduleId)) {
            return false;
        }

        $userPermissions = PermissionRepository::getPermissionsByUser($this);
        $module = Module::find($moduleId);

        if (!$module) {
            return false;
        }

        return Module::hasAccessToModule($module, $userPermissions);
    }


    public function canAccessRoute($route): bool
    {
        // Super Admin bypass
        if ($this->hasRole('Super Admin')) {
            return true;
        }

        $module = Module::where('route', $route)->first();
        if (!$module) {
            return true; // route tanpa module = allow
        }

        return $this->canAccessModule($module->id);
    }


    public function canPerformAction($permissionName): bool
    {
        if ($this->hasRole('Super Admin')) {
            return true;
        }

        $userPermissions = PermissionRepository::getPermissionsByUser($this);
        if (!in_array($permissionName, $userPermissions)) {
            return false;
        }

        if (!$this->tenant || !$this->tenant->hasActiveSubscription()) {
            return false;
        }

        $permission = Permission::where('name', $permissionName)->first();
        if (!$permission || !$permission->module_id) {
            return true;
        }

        $allowedPermissions = $this->tenant->getAllowedPermissionsForModule($permission->module_id);

        if ($allowedPermissions === null) {
            return true;
        }

        return in_array($permissionName, $allowedPermissions);
    }

    public function getModuleLimit($moduleId): ?int
    {
        if (!$this->tenant) {
            return 0;
        }

        return $this->tenant->getModuleLimit($moduleId);
    }
}
