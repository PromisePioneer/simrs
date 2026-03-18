<?php

declare(strict_types=1);

namespace Domains\Accounting\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccountCategoryModel extends BaseTenantModel
{
    protected $table    = 'account_categories';
    protected $fillable = ['id', 'tenant_id', 'name'];

    public function accounts(): HasMany
    {
        return $this->hasMany(AccountModel::class, 'account_category_id');
    }
}
