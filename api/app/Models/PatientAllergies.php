<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientAllergies extends Model
{
    use HasUuids;

    protected $table = 'patient_allergies';

    protected $fillable = [
        'outpatient_visit_id',

    ];


    public function outPatient(): BelongsTo
    {
        return $this->belongsTo(OutPatientVisit::class, 'outpatient_visit_id');
    }


}
