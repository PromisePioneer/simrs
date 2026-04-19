<?php

declare(strict_types=1);

namespace Domains\Clinical\Application\Services;

use Domains\Clinical\Domain\Repository\PrescriptionRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

final class PrescriptionService extends BaseCrudService
{
    public function __construct(
        private readonly PrescriptionRepositoryInterface $prescriptionRepo,
    ) {
        parent::__construct($prescriptionRepo);
    }

    protected function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }

    public function dispense(string $id, Request $request): object
    {
        return $this->prescriptionRepo->medicationDispensing($id, $request->input('status', 'dispensed'));
    }
}
