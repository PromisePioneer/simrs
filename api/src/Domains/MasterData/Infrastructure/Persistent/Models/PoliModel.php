<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel;

class PoliModel extends BaseTenantModel
{
    protected $table = 'poli';
    protected $fillable = ['id', 'name', 'tenant_id'];
}
