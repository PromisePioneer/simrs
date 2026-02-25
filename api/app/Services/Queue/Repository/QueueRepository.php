<?php

namespace App\Services\Queue\Repository;

use App\Models\Queue;
use App\Services\Queue\Interface\QueueRepositoryInterface;

class QueueRepository implements QueueRepositoryInterface
{

    protected Queue $model;

    public function __construct()
    {
        $this->model = new Queue();
    }

    public function findById(string $id): ?object
    {
        return $this->model->findOrFail($id);
    }

    public function getQueues(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->with(['outpatientVisit', 'outpatientVisit.patient']);

        // ✅ FIX: pisahkan dua kondisi — jangan taruh && di dalam !empty()
        if (!empty($filters['search'])) {
            $query->where('queue_number', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function store(array $data): ?object
    {
        return $this->model->create($data);
    }


    public function update(array $data, string $id): ?object
    {
        return $this->findById($id)->fill($data)->save($data)->fresh();
    }

    public function destroy(string $id): ?bool
    {
        return $this->findById($id)->delete();
    }


    public function changeStatus(string $id, string $status)
    {
        return $this->findById($id)->update(['status' => $status]);
    }


    public function changeStatusBasedOnVisitId(string $id, string $status): bool
    {
        return $this->model->where('outpatient_visit_id', $id)->update(['status' => $status]);
    }
}
