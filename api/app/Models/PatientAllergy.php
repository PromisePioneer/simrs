<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientAllergy extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'patient_allergies';
    protected $fillable = [
        'visit_list_id',
        'patient_allergy',
        'patient_medical_history',
        'patient_family_medical_history',
        'patient_medication_history'
    ];


    public function visitList(): BelongsTo
    {
        return $this->belongsTo(VisitList::class, 'visit_list_id');
    }

}
