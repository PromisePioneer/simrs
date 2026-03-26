<?php

declare(strict_types=1);

namespace Domains\Tenant\Infrastructure\Services;

use App\Models\Module;
use Illuminate\Support\Facades\Cache;

class SubscriptionCacheHelper
{
    /**
     * Panggil ini setiap kali subscription atau plan tenant berubah.
     * Contoh: setelah upgrade plan, aktivasi, atau cancel.
     */
    public static function clearModuleAccess(string $tenantId): void
    {
        // Hapus semua cache akses module untuk tenant ini.
        // Gunakan cache tags jika driver mendukung (Redis/Memcached).
        // Fallback: flush key per module yang diketahui.

        $modules = Module::pluck('id');

        foreach ($modules as $moduleId) {
            Cache::forget("tenant:{$tenantId}:module:{$moduleId}:access");
            Cache::forget("tenant:{$tenantId}:module:{$moduleId}:plan_access");
        }
    }
}
