<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;

/**
 * Cukup extend BaseModel, tidak perlu tulis ulang HasUuids dll.
 */
class DegreeModel extends BaseModel
{
    protected $table    = 'degrees';
    protected $fillable = ['id', 'name', 'type'];
}
