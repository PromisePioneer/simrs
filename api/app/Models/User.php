<?php

namespace App\Models;

use App\Notifications\VerifyEmail;
use App\Traits\Tenant\TenantManager;
use Database\Factories\UserFactory;
use Domains\IAM\Infrastructure\Persistence\Models\ModuleModel;
use Domains\IAM\Infrastructure\Persistence\Models\PermissionModel;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Domains\MasterData\Infrastructure\Persistent\Models\DegreeModel;
use Domains\MasterData\Infrastructure\Persistent\Models\PoliModel;
use Domains\MasterData\Infrastructure\Persistent\Models\RegistrationInstitutionModel;
use Domains\MedicalWork\Infrastructure\Persistence\Models\DoctorScheduleModel;
use Domains\Tenant\Application\Traits\HasActiveTenant;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, TenantManager, HasRoles, HasUuids, HasActiveTenant;

    public $incrementing = false;
    protected $keyType = 'string';
    protected string $guard_name = 'sanctum';

    protected $appends = ['full_name_with_degrees'];
    /**
     * The attributes that are mass-assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'poli_id',
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
        'email_verified_at',
        'id',
        'google_id',
        'avatar',
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


    public function roles(): BelongsToMany
    {
        $activeTenantId = null;

        // Get active tenant jika user sudah login
        if (auth()->check()) {
            $activeTenantId = auth()->user()->getActiveTenantId();
        }

        $relationship = $this->morphToMany(
            config('permission.models.role'),
            'model',
            config('permission.table_names.model_has_roles'),
            config('permission.column_names.model_morph_key'),
            'role_id'
        );

        // Filter berdasarkan active tenant
        if ($activeTenantId) {
            $relationship->where(function ($query) use ($activeTenantId) {
                $query->whereNull('roles.tenant_id')
                    ->orWhere('roles.tenant_id', $activeTenantId);
            });
        }

        // Team/Tenant support dari Spatie
        if (app(PermissionRegistrar::class)->teams) {
            $teamField = config('permission.table_names.roles') . '.' . config('permission.column_names.team_foreign_key');

            $relationship->where(function ($q) use ($teamField) {
                $q->whereNull($teamField)
                    ->orWhere($teamField, getPermissionsTeamId());
            });
        }

        return $relationship;
    }


    public function poli(): BelongsTo
    {
        return $this->belongsTo(PoliModel::class, 'poli_id');
    }

    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmail());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(TenantModel::class, 'tenant_id');
    }


    public function doctorSchedule(): HasMany
    {
        return $this->hasMany(DoctorScheduleModel::class, 'user_id');
    }


    public function degrees(): BelongsToMany
    {
        return $this->belongsToMany(
            DegreeModel::class,
            'user_degrees',  // pivot table
            'user_id',       // FK ke users
            'degree_id'      // FK ke degrees ← eksplisit, bukan auto-generate
        );
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
        return $this->hasOne(RegistrationInstitutionModel::class, 'id', 'str_institution_id');
    }


    public function sip(): HasOne
    {
        return $this->hasOne(RegistrationInstitutionModel::class, 'id', 'sip_institution_id');
    }

    public function getFullNameWithDegreesAttribute(): string
    {
        $prefix = $this->prefixes->pluck('name')->join(' ');
        $suffix = $this->suffixes->pluck('name')->join(', ');

        return trim(($prefix ? $prefix . ' ' : '') . $this->name . ($suffix ? ', ' . $suffix : ''));
    }

    public function scopeSameTenant($query): object
    {
        $user = auth()->user();

        if (!$user) {
            return $query->with(['roles', 'prefixes', 'suffixes']);
        }

        $activeTenantId = $user->getActiveTenantId();

        if (!$activeTenantId) {
            return $query->with(['roles', 'prefixes', 'suffixes']);
        }

        // Set permission team id dulu
        setPermissionsTeamId($activeTenantId);

        return $query
            ->where('users.tenant_id', $activeTenantId)
            ->with([
                'roles' => function ($query) use ($activeTenantId) {
                    // PENTING: Harus join ke pivot table model_has_roles
                    $query->where(function ($q) use ($activeTenantId) {
                        $q->whereNull('roles.tenant_id')
                            ->orWhere('roles.tenant_id', $activeTenantId);
                    });
                },
                'prefixes',
                'suffixes'
            ]);
    }
}
