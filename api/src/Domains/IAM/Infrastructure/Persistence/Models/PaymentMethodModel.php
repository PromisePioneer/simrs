<?php

namespace Domains\IAM\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;

class PaymentMethodModel extends BaseModel
{
    protected $table = 'payment_methods';
    protected $fillable = ['id', 'name', 'type'];
}
