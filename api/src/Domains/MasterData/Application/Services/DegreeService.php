<?php

declare(strict_types=1);

namespace Domains\MasterData\Application\Services;

use Domains\MasterData\Domain\Repository\DegreeRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\DegreeModel;
use Domains\Outpatient\Infrastructure\Persistence\Models\AppointmentModel;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class DegreeService extends BaseCrudService
{
    public function __construct(DegreeRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function extractFilters(Request $request): array
    {
        return $request->only(['search', 'type']);
    }

    public function bulkDelete(array $ids): void
    {
        DegreeModel::whereIn('id', $ids)->delete();
    }
}
