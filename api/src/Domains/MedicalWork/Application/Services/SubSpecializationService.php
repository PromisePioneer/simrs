<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Application\Services;

use Domains\MedicalWork\Domain\Repository\SubSpecializationRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class SubSpecializationService extends BaseCrudService
{
    public function __construct(
        private readonly SubSpecializationRepositoryInterface $subRepo
    ) {
        parent::__construct($subRepo);
    }

    public function getBySpecialization(string $specializationId, Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page') ? (int) $request->input('per_page') : null;
        return $this->subRepo->findBySpecialization($specializationId, $filters, $perPage);
    }
}
