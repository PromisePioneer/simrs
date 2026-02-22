<?php

namespace App\Services\Queue\Service;

use App\Models\Queue;
use App\Services\Queue\Repository\QueueRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class QueueService
{
    protected QueueRepository $queueRepository;

    public function __construct()
    {
        $this->queueRepository = new QueueRepository();
    }


    public function getQueues(Request $request)
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->queueRepository->getQueues(filters: $filters, perPage: $perPage);
    }


    public function store(Request $request)
    {
        $data = $request->all();
        return $this->queueRepository->store(data: $data);
    }


    public function update(Request $request, Queue $queue)
    {
        $data = $request->all();
        return $this->queueRepository->update(data: $data, id: $queue->id);
    }


    public function destroy(Queue $queue)
    {
        return $this->queueRepository->destroy(id: $queue->id);
    }


    /**
     * @throws Throwable
     */
    public function generate(string $tenantId, string $serviceUnit): string
    {
        return DB::transaction(function () use ($tenantId, $serviceUnit) {

            $today = now()->toDateString();

            $lastQueue = Queue::where('tenant_id', $tenantId)
                ->where('service_unit', $serviceUnit)
                ->whereDate('queue_date', $today)
                ->lockForUpdate()
                ->orderByDesc('queue_number')
                ->first();

            $nextNumber = 1;

            if ($lastQueue) {
                $lastNumeric = (int)substr($lastQueue->queue_number, -3);
                $nextNumber = $lastNumeric + 1;
            }

            $formattedNumber = str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

            return strtoupper($serviceUnit) . $formattedNumber;
        });
    }

}
