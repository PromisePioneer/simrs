<?php

declare(strict_types=1);

namespace Domains\Inpatient\Application\Services;

use Domains\Inpatient\Domain\Repository\InpatientDailyCareRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

readonly class InpatientDailyCareService
{
    public function __construct(
        private InpatientDailyCareRepositoryInterface $dailyCareRepository,
    ) {}

    public function getByAdmission(string $admissionId, Request $request): object
    {
        return $this->dailyCareRepository->getByAdmission(
            admissionId: $admissionId,
            filters:     $request->only(['search']),
            perPage:     (int) $request->input('per_page') ?: null,
        );
    }

    /** @throws Throwable */
    public function store(array $data): object
    {
        $data['doctor_id'] = Auth::id();

        return $this->dailyCareRepository->store($data);
    }

    /** @throws Throwable */
    public function update(array $data, string $id): object
    {
        return $this->dailyCareRepository->update($data, $id);
    }

    /** @throws Throwable */
    public function destroy(string $id): object
    {
        return $this->dailyCareRepository->destroy($id);
    }
}
