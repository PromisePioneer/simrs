<?php

declare(strict_types=1);

namespace Domains\Shared\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\Scopes\TenantScope;

/**
 * Base Model untuk entity yang punya tenant_id.
 *
 * @deprecated  Gunakan \Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel
 *              sebagai base class untuk model-model di dalam domain masing-masing.
 *              Class ini dipertahankan agar model lama yang masih extends Shared\BaseTenantModel
 *              tidak langsung break.
 *
 * Contoh:
 *   class DepartmentModel extends BaseTenantModel  ← tetap jalan
 *   {
 *       protected $table = 'departments';
 *   }
 */
abstract class BaseTenantModel extends BaseModel
{
    protected static function booted(): void
    {
        // Scope sekarang diambil dari Tenant domain, bukan dari Shared.
        static::addGlobalScope(new TenantScope());
    }
}
