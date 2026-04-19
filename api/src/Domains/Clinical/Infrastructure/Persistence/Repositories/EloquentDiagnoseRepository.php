<?php

declare(strict_types=1);

namespace Domains\Clinical\Infrastructure\Persistence\Repositories;

use Domains\Clinical\Domain\Repository\DiagnoseRepositoryInterface;
use Domains\Clinical\Infrastructure\Persistence\Models\DiagnoseModel;

class EloquentDiagnoseRepository implements DiagnoseRepositoryInterface
{
    public function __construct(private readonly DiagnoseModel $model) {}

    public function storeMany(string $visitId, array $diagnoses): void
    {
        $this->model->newQuery()->insert(
            collect($diagnoses)->map(fn($d) => array_merge($d, [
                'outpatient_visit_id' => $visitId,
                'created_at'          => now(),
                'updated_at'          => now(),
            ]))->toArray()
        );
    }
}
