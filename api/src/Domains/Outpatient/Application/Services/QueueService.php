<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\Services;

use Domains\Outpatient\Domain\Repository\QueueRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

final class QueueService extends BaseCrudService
{
    public function __construct(
        private readonly QueueRepositoryInterface $queueRepo,
    ) {
        parent::__construct($queueRepo);
    }

    protected function extractFilters(Request $request): array
    {
        return $request->only(['search', 'status']);
    }

    public function startDiagnose(string $id): bool
    {
        return $this->queueRepo->changeStatus($id, 'in-progress');
    }

    public function countTodayQueues(): array
    {
        return [
            'today_queues' => $this->queueRepo->countTodayQueues(now()->toDateString()),
            'waiting'      => $this->queueRepo->countTodayBasedOnQueueStatus('waiting'),
            'in_progress'  => $this->queueRepo->countTodayBasedOnQueueStatus('in_progress'),
            'completed'    => $this->queueRepo->countTodayBasedOnQueueStatus('completed'),
        ];
    }
}
