<?php

declare(strict_types=1);

namespace Domains\Patient\Application\Queries;

/**
 * Query: Ambil daftar pasien dengan filter dan paginasi.
 *
 * Dalam CQRS, Query dipisah dari Command.
 * Query TIDAK mengubah state apapun.
 */
final readonly class GetPatientsQuery
{
    public function __construct(
        public ?string $tenantId,
        public ?string $search = null,
        public int     $perPage = 15,
        public int     $page = 1,
    )
    {
    }
}
