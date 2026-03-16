<?php

namespace Domains\IAM\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;

class RoleModel extends BaseModel
{

    protected string $guard_name = 'sanctum';
    protected $hidden = ['pivot'];

    protected $table = 'roles';
    protected $fillable = [
        'name',
        'guard_name',
        'tenant_id'
    ];


}
