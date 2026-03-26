<?php

declare(strict_types=1);

namespace Domains\Tenant\Infrastructure\Services;

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
