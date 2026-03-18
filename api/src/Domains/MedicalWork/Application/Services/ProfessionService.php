<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Application\Services;

use Domains\MedicalWork\Domain\Repository\ProfessionRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;

class ProfessionService extends BaseCrudService
{
    public function __construct(ProfessionRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
