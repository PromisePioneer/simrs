<?php

declare(strict_types=1);

namespace Domains\Tenant\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Domains\Tenant\Infrastructure\Persistence\Models\Scopes\TenantScope;

/**
 * Base Model untuk semua Eloquent model yang memiliki tenant_id.
 *
 * Contoh pemakaian:
 *   class DepartmentModel extends BaseTenantModel
 *   {
 *       protected $table = 'departments';
 *   }
 *
 * Menggantikan:
 *   - App\Models\TenantScopeBaseModel (alias lama yang dipakai di src/Domains)
 *   - Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel
 */
abstract class BaseTenantModel extends BaseModel
{
    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }
}
