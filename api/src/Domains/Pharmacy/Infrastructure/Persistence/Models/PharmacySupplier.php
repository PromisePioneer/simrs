<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PharmacySupplier extends Model
{
    protected $table = 'pharmacy_suppliers';

    protected $fillable = [
        'tenant_id',
        'name',
        'code',
        'contact_person',
        'phone',
        'email',
        'address',
        'city',
        'province',
        'postal_code',
        'bank_name',
        'bank_account',
        'bank_account_name',
        'discount_percentage',
        'tax_percentage',
        'status',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'tax_percentage' => 'decimal:2',
    ];

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PharmacyPurchaseOrder::class, 'supplier_id');
    }

    public function purchaseReturns(): HasMany
    {
        return $this->hasMany(PharmacyPurchaseReturn::class, 'supplier_id');
    }
}
