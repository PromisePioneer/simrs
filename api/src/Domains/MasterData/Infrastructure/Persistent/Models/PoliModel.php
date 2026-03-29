<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;


use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;

class PoliModel extends BaseTenantModel
{
    protected $table = 'poli';
    protected $fillable = ['id', 'name', 'consultation_fee', 'tenant_id'];

    protected $casts = [
        'consultation_fee' => 'decimal:2',
    ];
}
