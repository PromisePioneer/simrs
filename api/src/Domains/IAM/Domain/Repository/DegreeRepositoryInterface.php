<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Repository;

use Domains\Shared\Domain\Repository\BaseRepositoryInterface;

/**
 * Extend BaseRepositoryInterface.
 * Kalau tidak ada method tambahan, isinya kosong pun tidak apa-apa.
 * Tapi tetap dibuat untuk keperluan binding di ServiceProvider.
 */
interface DegreeRepositoryInterface extends BaseRepositoryInterface
{
}
