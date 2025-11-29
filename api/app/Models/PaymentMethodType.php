<?php

namespace App\Models;

use Database\Factories\PaymentMethodTypeFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethodType extends Model
{
    /** @use HasFactory<PaymentMethodTypeFactory> */
    use HasUuids, HasFactory;

    protected $table = 'payment_method_types';
    protected $fillable = [
        'name',
    ];
}
