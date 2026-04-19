<?php

declare(strict_types=1);

namespace Domains\Patient\Application\QueryHandlers;

use Domains\Patient\Application\Queries\GetPatientEMRQuery;
use Domains\Patient\Domain\Repository\PatientRepositoryInterface;

/**
 * Query Handler: Ambil pasien + EMR lengkap.
 */
final class GetPatientEMRQueryHandler
{
    public function __construct(
        private readonly PatientRepositoryInterface $repository,
    ) {}

    public function handle(GetPatientEMRQuery $query): object
    {
        $filters = [];

        if ($query->search !== null) {
            $filters['search'] = $query->search;
        }

        return $this->repository->findAllWithEMR(
            tenantId: $query->tenantId,
            filters:  $filters,
            perPage:  $query->perPage,
        );
    }
}
