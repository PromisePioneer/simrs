<?php

namespace Domains\MasterData\Infrastructure\Persistent\Models;


use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;

class RegistrationInstitutionModel extends BaseModel
{
    protected $table = 'registration_institutions';
    protected $fillable = [
        'name',
        'type'
    ];
}
