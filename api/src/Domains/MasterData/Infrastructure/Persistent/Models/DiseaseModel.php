<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;

class DiseaseModel extends BaseTenantModel
{
    protected $table = 'diseases';

    protected $fillable = [
        'tenant_id',
        'code',
        'name',
        'symptoms',
        'description',
        'valid_code',
        'accpdx',
        'asterisk',
        'im',
        'status'
    ];
}
