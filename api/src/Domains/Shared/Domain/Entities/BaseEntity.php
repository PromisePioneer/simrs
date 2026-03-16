<?php

declare(strict_types=1);

namespace Domains\Shared\Domain\Entities;

/**
 * Base Entity untuk semua domain.
 *
 * Semua entity yang punya domain events extend class ini.
 * Entity kompleks (Patient, Outpatient) extend ini + tambah behaviour sendiri.
 * Entity sederhana (Degree, Department) extend ini + cukup guard minimal.
 */
abstract class BaseEntity
{
    private array $domainEvents = [];

    protected function recordEvent(object $event): void
    {
        $this->domainEvents[] = $event;
    }

    /** @return object[] */
    public function pullDomainEvents(): array
    {
        $events            = $this->domainEvents;
        $this->domainEvents = [];
        return $events;
    }

    abstract public function id(): string;
}
