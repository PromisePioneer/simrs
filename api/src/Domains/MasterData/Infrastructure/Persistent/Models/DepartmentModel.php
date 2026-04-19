<?php

declare(strict_types=1);

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel;

class DepartmentModel extends BaseTenantModel
{
    protected $table    = 'departments';
    protected $fillable = ['id', 'name', 'description', 'tenant_id'];
}
