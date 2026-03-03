<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientInsuranceClaim extends Model
{
    use HasUuids;


    protected $table = 'patient_insurance_claims';
    protected $fillable = [
        'outpatient_visit_id',
        'payment_id',
        'claim_number',
        'insurance_provider',
        'claim_amount',
        'claim_status',
        'submitted_at',
        'paid_at'
    ];


    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisit::class, 'outpatient_visit_id');
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }
}
