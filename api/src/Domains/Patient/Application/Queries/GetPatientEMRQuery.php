<?php

declare(strict_types=1);

namespace Domains\Patient\Application\Queries;

/**
 * Query: Ambil pasien beserta Electronic Medical Record (EMR) lengkap.
 */
final readonly class GetPatientEMRQuery
{
    public function __construct(
        public ?string $tenantId,
        public ?string $search = null,
        public int     $perPage = 15,
    )
    {
    }
}
