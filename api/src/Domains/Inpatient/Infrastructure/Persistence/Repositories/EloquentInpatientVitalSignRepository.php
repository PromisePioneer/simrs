<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Repositories;

use Domains\Inpatient\Domain\Repository\InpatientVitalSignRepositoryInterface;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientVitalSignModel;

readonly class EloquentInpatientVitalSignRepository implements InpatientVitalSignRepositoryInterface
{
    public function __construct(private InpatientVitalSignModel $model) {}

    public function store(array $data): object
    {
        return $this->model->create($data);
    }
}
