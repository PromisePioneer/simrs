<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Repositories;

use Domains\Outpatient\Domain\Repository\QueueRepositoryInterface;
use Domains\Outpatient\Infrastructure\Persistence\Models\QueueModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentQueueRepository extends BaseEloquentRepository implements QueueRepositoryInterface
{
    public function __construct() { parent::__construct(new QueueModel()); }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('queue_number', 'like', '%' . $filters['search'] . '%');
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        return $query;
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()
            ->with([
                'outpatientVisit.patient' => fn($q) => $q->withoutGlobalScopes(),
                'outpatientVisit.doctor',
            ])
            ->orderByDesc('queue_date');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function changeStatus(string $id, string $status): bool
    {
        return (bool) $this->model->newQuery()->where('id', $id)->update(['status' => $status]);
    }

    public function changeStatusBasedOnVisitId(string $id, string $status): bool
    {
        return (bool) $this->model->newQuery()
            ->where('outpatient_visit_id', $id)
            ->update(['status' => $status]);
    }

    public function countTodayQueues(string $today): int
    {
        return $this->model->newQuery()->whereDate('queue_date', $today)->count();
    }

    public function countTodayBasedOnQueueStatus(string $status): int
    {
        return $this->model->newQuery()
            ->whereDate('queue_date', now()->toDateString())
            ->where('status', $status)
            ->count();
    }
}
