<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentMethodModel extends BaseModel
{
    protected $table = 'payment_methods';
    protected $fillable = ['id', 'name', 'payment_method_type_id'];


    public function paymentMethodType(): BelongsTo
    {
        return $this->belongsTo(PaymentMethodTypeModel::class, 'payment_method_type_id');
    }
}
