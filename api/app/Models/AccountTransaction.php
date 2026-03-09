<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountTransaction extends TenantScopeBaseModel
{

    use HasUuids, HasFactory;

    protected $table = 'account_transactions';
    protected $fillable = [
        'tenant_id',
        'account_id',
        'type',
        'amount',
        'description'
    ];


    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'account_id');
    }
}
