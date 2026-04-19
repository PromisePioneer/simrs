<?php

declare(strict_types=1);

namespace Domains\Inpatient\Domain\Enum;

enum InpatientMedicationStatus: string
{
    case DRAFT = 'draft';
    case DISPENSED = 'dispensed';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::DISPENSED => 'Sudah Diberikan',
            self::CANCELLED => 'Dibatalkan',
        };
    }
}
