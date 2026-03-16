<?php

declare(strict_types=1);

namespace Domains\Patient\Application\Queries;

/**
 * Query: Ambil pasien beserta Electronic Medical Record (EMR) lengkap.
 */
final class GetPatientEMRQuery
{
    public function __construct(
        public readonly string  $tenantId,
        public readonly ?string $search  = null,
        public readonly int     $perPage = 15,
    ) {}
}
