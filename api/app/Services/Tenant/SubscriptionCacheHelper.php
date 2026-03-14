<?php

namespace App\Services\Tenant;

use Illuminate\Support\Facades\Cache;

class SubscriptionCacheHelper
{
    /**
     * Panggil ini setiap kali subscription atau plan tenant berubah.
     * Contoh: setelah upgrade plan, aktivasi, atau cancel.
     */
    public static function clearModuleAccess(string $tenantId): void
    {
        // Hapus semua cache akses module untuk tenant ini
        // Karena key-nya pakai module id, kita perlu clear by pattern
        // Gunakan cache tags jika driver mendukung (Redis/Memcached)
        // Fallback: flush key per module yang diketahui

        $modules = \App\Models\Module::pluck('id');

        foreach ($modules as $moduleId) {
            Cache::forget("tenant:{$tenantId}:module:{$moduleId}:access");
        }
    }
}
