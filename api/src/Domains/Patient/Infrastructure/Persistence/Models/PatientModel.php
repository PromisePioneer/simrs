<?php

declare(strict_types=1);

namespace Domains\Patient\Infrastructure\Persistence\Models;

use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Domains\Tenant\Infrastructure\Persistence\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Eloquent Model: PatientModel
 *
 * INI BUKAN Domain Entity.
 * Model ini hanya digunakan oleh Infrastructure layer
 * untuk komunikasi dengan database.
 *
 * Naming convention: suffix "Model" untuk membedakan
 * dari domain Entity "Patient".
 *
 * Tidak ada business logic di sini — hanya mapping ke DB.
 */
class PatientModel extends BaseTenantModel
{
    use HasUuids;

    protected $table = 'patients';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'tenant_id',
        'medical_record_number',
        'full_name',
        'city_of_birth',
        'date_of_birth',
        'id_card_number',
        'gender',
        'religion',
        'blood_type',
        'job',
        'kis_number',
        'phone',
        'email',
        'date_of_consultation',
        'profile_picture',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_of_consultation' => 'date',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }

    // =========================================================================
    // Relations (untuk query read, bukan untuk domain logic)
    // =========================================================================

    public function addresses(): HasMany
    {
        return $this->hasMany(PatientAddressModel::class, 'patient_id');
    }

    public function paymentMethods(): HasMany
    {
        return $this->hasMany(PatientPaymentMethodModel::class, 'patient_id');
    }

    public function outpatientVisits(): HasMany
    {
        // Masih menggunakan model lama sampai Outpatient domain di-migrate ke DDD
        return $this->hasMany(OutpatientVisitModel::class, 'patient_id');
    }
}
