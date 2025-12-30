<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientAddress extends Model
{

    use HasUuids;


    protected $primaryKey = 'patient_id';
    protected $table = 'patient_address';
    public $timestamps = false;

    protected $fillable = [
        'patient_id',
        'address',
        'province',
        'city',
        'subdistrict',
        'ward',
        'postal_code'
    ];


    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
