<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object: Jadwal praktek dokter.
 */
final class DoctorSchedule
{
    private const VALID_DAYS = [
        'monday', 'tuesday', 'wednesday', 'thursday',
        'friday', 'saturday', 'sunday',
    ];

    public function __construct(
        private readonly string $dayOfWeek,
        private readonly string $startTime,
        private readonly string $endTime,
    ) {
        $this->validate();
    }

    private function validate(): void
    {
        if (!in_array($this->dayOfWeek, self::VALID_DAYS, true)) {
            throw new InvalidArgumentException("Hari tidak valid: {$this->dayOfWeek}");
        }
        if ($this->startTime >= $this->endTime) {
            throw new InvalidArgumentException('Jam mulai harus sebelum jam selesai.');
        }
    }

    public static function fromArray(array $data): self
    {
        return new self(
            dayOfWeek: $data['day_of_week'],
            startTime: $data['start_time'],
            endTime:   $data['end_time'],
        );
    }

    public function dayOfWeek(): string { return $this->dayOfWeek; }
    public function startTime(): string { return $this->startTime; }
    public function endTime(): string   { return $this->endTime; }

    public function toArray(): array
    {
        return [
            'day_of_week' => $this->dayOfWeek,
            'start_time'  => $this->startTime,
            'end_time'    => $this->endTime,
        ];
    }
}
