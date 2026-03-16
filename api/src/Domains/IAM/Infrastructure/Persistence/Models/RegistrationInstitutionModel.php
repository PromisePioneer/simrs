<?php

namespace Domains\IAM\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel;

class RegistrationInstitutionModel extends BaseTenantModel
{
    protected $table = 'registration_institutions';
    protected $fillable = [
        'name',
        'type'
    ];
}
