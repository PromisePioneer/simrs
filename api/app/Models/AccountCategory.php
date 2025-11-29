<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccountCategory extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'account_categories';
    protected $fillable = [
        'tenant_id',
        'name'
    ];


    public function accountCategory(): HasMany
    {
        return $this->hasMany(AccountCategory::class, 'account_category_id');
    }

}
