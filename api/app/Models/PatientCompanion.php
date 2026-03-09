<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientCompanion extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'patient_companions';
    protected $fillable = [
        'visit_list_id',
        'full_name',
        'phone',
        'address',
    ];


    public function visitList(): BelongsTo
    {
        return $this->belongsTo(VisitList::class, 'visit_list_id');
    }
}
