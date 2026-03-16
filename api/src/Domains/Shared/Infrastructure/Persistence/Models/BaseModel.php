<?php

declare(strict_types=1);

namespace Domains\Shared\Infrastructure\Persistence\Models;

use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * Base Eloquent Model untuk semua domain.
 *
 * Semua Eloquent Model di Infrastructure layer extend ini.
 *
 * Contoh:
 *   class DegreeModel extends BaseModel { protected $table = 'degrees'; }
 *   class DepartmentModel extends BaseTenantModel { ... } ← pakai BaseTenantModel
 */
abstract class BaseModel extends Model
{
    use HasUuids;

    public    $incrementing = false;
    protected $keyType      = 'string';
    protected $primaryKey   = 'id';
}
