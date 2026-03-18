<?php

declare(strict_types=1);

namespace Domains\Accounting\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountTransactionModel extends BaseTenantModel
{
    protected $table    = 'account_transactions';
    protected $fillable = ['id', 'tenant_id', 'account_id', 'type', 'amount', 'description'];

    public function account(): BelongsTo
    {
        return $this->belongsTo(AccountModel::class, 'account_id');
    }
}
