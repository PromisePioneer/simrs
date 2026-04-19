<?php

namespace Domains\IAM\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Spatie\Permission\Models\Role;

class RoleModel extends Role
{
    use HasUuids;

    protected string $guard_name = 'sanctum';
    protected $hidden = ['pivot'];

    protected $primaryKey = 'uuid';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $table = 'roles';
    protected $fillable = [
        'name',
        'guard_name',
        'tenant_id',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
