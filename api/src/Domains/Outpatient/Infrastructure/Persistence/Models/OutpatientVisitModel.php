<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use App\Models\User;
use Domains\Clinical\Infrastructure\Persistence\Models\DiagnoseModel;
use Domains\Clinical\Infrastructure\Persistence\Models\PatientVitalSignModel;
use Domains\Clinical\Infrastructure\Persistence\Models\PrescriptionModel;
use Domains\Clinical\Infrastructure\Persistence\Models\ProcedureModel;
use Domains\MasterData\Infrastructure\Persistent\Models\PoliModel;
use Domains\Patient\Infrastructure\Persistence\Models\PatientModel;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OutpatientVisitModel extends BaseTenantModel
{
    protected $table = 'outpatient_visits';
    protected $fillable = [
        'id', 'tenant_id', 'type', 'referred_hospital', 'referred_doctor',
        'patient_id', 'doctor_id', 'poli_id', 'date', 'complain', 'status',
        'outpatient_visit_id',
        'patient_allergy',
        'medical_history',
        'family_medical_history',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientModel::class, 'patient_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function poli(): BelongsTo
    {
        return $this->belongsTo(PoliModel::class, 'poli_id');
    }

    public function vitalSign(): HasOne
    {
        return $this->hasOne(PatientVitalSignModel::class, 'outpatient_visit_id');
    }

    public function companion(): HasOne
    {
        return $this->hasOne(PatientCompanionModel::class, 'outpatient_visit_id');
    }

    public function allergy(): HasOne
    {
        return $this->hasOne(PatientAllergyModel::class, 'outpatient_visit_id');
    }

    public function medicationHistory(): HasOne
    {
        return $this->hasOne(PatientMedicationHistoryModel::class, 'outpatient_visit_id');
    }

    public function medicalHistory(): HasOne
    {
        return $this->hasOne(PatientMedicalHistoryModel::class, 'outpatient_visit_id');
    }

    public function familyMedicalHistory(): HasOne
    {
        return $this->hasOne(PatientFamilyMedicalHistoryModel::class, 'outpatient_visit_id');
    }

    public function psychosocial(): HasOne
    {
        return $this->hasOne(PatientPsychosocialModel::class, 'outpatient_visit_id');
    }

    public function diagnoses(): HasMany
    {
        return $this->hasMany(DiagnoseModel::class, 'outpatient_visit_id');
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(PrescriptionModel::class, 'outpatient_visit_id');
    }

    public function procedures(): HasMany
    {
        return $this->hasMany(ProcedureModel::class, 'outpatient_visit_id');
    }

    public function queue(): HasOne
    {
        return $this->hasOne(QueueModel::class, 'outpatient_visit_id');
    }
}
