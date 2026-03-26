<?php

declare(strict_types=1);

namespace Domains\Tenant\Domain\Events;

class TenantUpdated
{
    public function __construct(
        private readonly string $tenantId,
        private readonly array  $changes,
    ) {}

    public function getTenantId(): string { return $this->tenantId; }
    public function getChanges(): array   { return $this->changes; }
}
