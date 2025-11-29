<?php

namespace App\Models;

use Database\Factories\AccountFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    /** @use HasFactory<AccountFactory> */
    use HasUuids, HasFactory;

    protected $table = 'account_categories';
    protected $fillable = [
        'tenant_id',
        'account_category_id',
        'code',
        'name',
        'parent_id',
    ];


    public function accountCategory(): BelongsTo
    {
        return $this->belongsTo(AccountCategory::class, 'account_category_id');
    }


    public function children(): HasMany
    {
        return $this->hasMany(Account::class, 'parent_id');
    }
}
