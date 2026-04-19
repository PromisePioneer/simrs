<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Application\Services;

use Domains\MedicalWork\Domain\Repository\SpecializationRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class SpecializationService extends BaseCrudService
{
    public function __construct(
        private readonly SpecializationRepositoryInterface $specializationRepo
    ) {
        parent::__construct($specializationRepo);
    }

    public function getByProfession(string $professionId, Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page') ? (int) $request->input('per_page') : null;
        return $this->specializationRepo->findByProfession($professionId, $filters, $perPage);
    }
}
