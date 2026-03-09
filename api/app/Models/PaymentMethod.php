<?php

namespace App\Models;

use Database\Factories\PaymentMethodFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentMethod extends Model
{
    /** @use HasFactory<PaymentMethodFactory> */
    use HasFactory, HasUuids;

    protected $primaryKey = 'id';

    protected $table = 'payment_methods';
    protected $fillable = [
        'name',
        'payment_method_type_id'
    ];


    public function paymentMethodType(): BelongsTo
    {
        return $this->belongsTo(PaymentMethodType::class, 'payment_method_type_id');
    }
}
