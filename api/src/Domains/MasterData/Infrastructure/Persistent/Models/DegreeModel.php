<?php

declare(strict_types=1);

namespace Domains\MasterData\Infrastructure\Persistent\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;

class DegreeModel extends BaseModel
{
    protected $table = 'degrees';
    protected $fillable = ['id', 'name', 'type'];
}
