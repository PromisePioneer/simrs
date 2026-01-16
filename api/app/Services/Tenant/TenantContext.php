<?php

namespace App\Services\Tenant;

use Illuminate\Support\Facades\Auth;

class TenantContext
{
    public static function getId(): ?string
    {
        return session('tenant_id') ?? Auth::user()?->tenant_id;
    }

    public static function set(?string $tenantId): void
    {
        session(['tenant_id' => $tenantId]);
    }

    public static function forget(): void
    {
        session()->forget('tenant_id');
    }
}
