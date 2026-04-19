<?php

declare(strict_types=1);

namespace Domains\Patient\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Eloquent Model untuk tabel patient_address.
 * Hanya dipakai di Infrastructure layer.
 */
class PatientAddressModel extends Model
{
    protected $table      = 'patient_address';
    protected $primaryKey = 'patient_id';
    public    $timestamps = false;
    public    $incrementing = false;
    protected $keyType    = 'string';

    protected $fillable = [
        'patient_id',
        'address',
        'province',
        'city',
        'subdistrict',
        'ward',
        'postal_code',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientModel::class, 'patient_id');
    }
}
