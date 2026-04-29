<?php

declare(strict_types=1);

namespace Domains\Accounting\Infrastructure\Persistence\Models;


use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccountModel extends BaseTenantModel
{
    protected $table = 'accounts';
    protected $fillable = ['id', 'tenant_id', 'account_category_id', 'code', 'name', 'parent_id'];

    public function accountCategory(): BelongsTo
    {
        return $this->belongsTo(AccountCategoryModel::class, 'account_category_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(AccountModel::class, 'parent_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(AccountTransactionModel::class, 'account_id');
    }
}
