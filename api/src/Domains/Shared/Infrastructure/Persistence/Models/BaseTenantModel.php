<?php

declare(strict_types=1);

namespace Domains\Shared\Infrastructure\Persistence\Models;

use App\Models\Scopes\TenantScope;

/**
 * Base Model untuk entity yang punya tenant_id.
 *
 * Contoh:
 *   class DepartmentModel extends BaseTenantModel
 *   {
 *       protected $table = 'departments';
 *   }
 */
abstract class BaseTenantModel extends BaseModel
{
    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }
}
