<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Infrastructure\Persistence\Repositories;

use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;
use Domains\Subscriptions\Domain\Repository\PlanRepositoryInterface;
use Domains\Subscriptions\Infrastructure\Persistence\Models\PlanModel;

class EloquentPlanRepository extends BaseEloquentRepository implements PlanRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new PlanModel());
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()
            ->with(['modules'])
            ->orderBy('price');

        $query = $this->applyFilters($query, $filters);

        return $perPage ? $query->paginate($perPage) : (object)$query->get();
    }

    public function findBySlug(string $slug): ?object
    {
        return $this->model->where('slug', $slug)->first();
    }


    public function findByName(string $name): ?object
    {
        return $this->model->where('name', $name)->first();
    }

    public function bulkDelete(array $ids): void
    {
        $this->model->whereIn('id', $ids)->delete();
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('price', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query;
    }
}
