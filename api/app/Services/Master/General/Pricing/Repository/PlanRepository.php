<?php

namespace App\Services\Master\General\Pricing\Repository;

use App\Models\Plan;
use App\Services\Master\General\Pricing\Interface\PlanRepositoryInterface;

class PlanRepository implements PlanRepositoryInterface
{
    private Plan $model;

    public function __construct()
    {
        $this->model = new Plan();
    }

    public function baseQuery(array $filters = []): object
    {
        $query = $this->model->orderBy('price')->with(['subscriptions', 'modules']);

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                ->orWhere('price', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }


    public function getAll(array $filters = [], ?int $perPage = null): object
    {
        return $perPage ? $this->baseQuery($filters)->paginate($perPage) : $this->baseQuery($filters)->get();
    }


    public function findById(string $id): ?object
    {
        return $this->model->findOrFail($id);
    }


    public function findByName(string $name): ?object
    {
        return $this->model->where('name', $name)->first();
    }

    public function store(array $data = []): object
    {
        return $this->model->create($data);
    }


    public function update(string $id, array $data = []): object
    {
        $plan = $this->findById($id);
        $plan->fill($data);
        $plan->save();
        return $plan->fresh();
    }


    public function destroy(string $id): bool
    {
        return $this->findById($id)->delete();
    }

    public function bulkDestroy(array $ids): bool
    {
        return $this->model->whereIn('id', $ids)->delete();
    }
}
