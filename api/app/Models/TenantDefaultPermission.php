<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantDefaultPermission extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'tenant_default_permissions';
    protected $fillable = [
        'name',
        'guard_name',
        'tenant_default_role_id'
    ];


    public function tenantDefaultRole(): BelongsTo
    {
        return $this->belongsTo(TenantDefaultRole::class, 'tenant_default_role_id');
    }
}
