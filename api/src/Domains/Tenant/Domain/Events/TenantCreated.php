<?php

declare(strict_types=1);

namespace Domains\Tenant\Domain\Events;

class TenantCreated
{
    public function __construct(
        private readonly string $tenantId,
        private readonly string $tenantName,
    ) {}

    public function getTenantId(): string   { return $this->tenantId; }
    public function getTenantName(): string { return $this->tenantName; }
}
