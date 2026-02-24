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


        if (!empty($filters['search'])) {
            $query->where('queue_number', 'like', '%' . $filters['search'] . '%')
                ->where('name', 'like', '%' . $filters['search'] . '%');
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

    public function startDiagnose(string $id): bool
    {
        return $this->findById($id)->update(['status' => 'in-progress']);
    }

    public function destroy(string $id): ?bool
    {
        return $this->findById($id)->delete();
    }
}
