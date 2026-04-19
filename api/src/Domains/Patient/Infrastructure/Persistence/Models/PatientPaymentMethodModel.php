<?php

declare(strict_types=1);

namespace Domains\Patient\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Eloquent Model untuk tabel patient_payment_methods.
 * Hanya dipakai di Infrastructure layer.
 */
class PatientPaymentMethodModel extends Model
{
    protected $table      = 'patient_payment_methods';
    protected $primaryKey = 'patient_id';
    public    $timestamps = false;
    public    $incrementing = false;
    protected $keyType    = 'string';

    protected $fillable = [
        'patient_id',
        'payment_method_type_id',
        'bpjs_number',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientModel::class, 'patient_id');
    }
}
