<?php

declare(strict_types=1);

namespace Domains\Patient\Application\QueryHandlers;

use Domains\Patient\Application\Queries\GetPatientsQuery;
use Domains\Patient\Domain\Repository\PatientRepositoryInterface;

/**
 * Query Handler: Menangani pengambilan daftar pasien.
 *
 * Query handler boleh return data mentah (array/paginator)
 * karena tidak mengubah state dan tidak perlu emit event.
 */
final class GetPatientsQueryHandler
{
    public function __construct(
        private readonly PatientRepositoryInterface $repository,
    ) {}

    public function handle(GetPatientsQuery $query): object
    {
        $filters = [];

        if ($query->search !== null) {
            $filters['search'] = $query->search;
        }

        return $this->repository->findAll(
            tenantId: $query->tenantId,
            filters:  $filters,
            perPage:  $query->perPage,
            page:     $query->page,
        );
    }
}
