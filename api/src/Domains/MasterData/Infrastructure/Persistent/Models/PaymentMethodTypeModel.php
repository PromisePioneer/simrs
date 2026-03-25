<?php

declare(strict_types=1);

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethodTypeModel extends BaseModel
{
    protected $table    = 'payment_method_types';
    protected $fillable = ['name'];

    public function paymentMethods(): HasMany
    {
        return $this->hasMany(PaymentMethodModel::class, 'type');
    }
}
