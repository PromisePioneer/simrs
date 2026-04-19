<?php

declare(strict_types=1);

namespace Domains\Inpatient\Application\Services;

use App\Services\Tenant\TenantContext;
use App\Traits\Tenant\TenantManager;
use Domains\Inpatient\Domain\Repository\InpatientDailyMedicationRepositoryInterface;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientDailyMedicationModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

readonly class InpatientDailyMedicationService
{
    public function __construct(
        private InpatientDailyMedicationRepositoryInterface $medicationRepository,
    )
    {
    }

    public function getByAdmission(string $admissionId, Request $request): object
    {
        return $this->medicationRepository->getByAdmission(
            admissionId: $admissionId,
            filters: $request->only(['search', 'status', 'given_date']),
            perPage: (int)$request->input('per_page') ?: null,
        );
    }

    public function show(string $id): object
    {
        return $this->medicationRepository->findById($id);
    }

    /** @throws Throwable */
    public function store(array $data): object
    {
        $data['prescribed_by'] = Auth::id();
        $data['tenant_id'] = TenantContext::getId();
        $data['status'] = 'draft';

        return $this->medicationRepository->store($data);
    }

    /** @throws Throwable */
    public function update(array $data, string $id): object
    {
        return $this->medicationRepository->update($data, $id);
    }

    /** @throws Throwable */
    public function dispense(string $id): object
    {
        return $this->medicationRepository->dispense($id);
    }

    /** @throws Throwable */
    public function cancel(string $id): object
    {
        return $this->medicationRepository->cancel($id);
    }

    /** @throws Throwable */
    public function destroy(string $id): object
    {
        return $this->medicationRepository->destroy($id);
    }
}
