<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientPaymentItem extends Model
{
    use HasUuids;

    protected $table = 'patient_payment_items';

    protected $fillable = [
        'payment_id',
        'item_type',
        'item_name',
        'qty',
        'price',
        'total',
    ];


    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }
}
