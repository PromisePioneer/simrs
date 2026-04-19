<?php

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use Domains\MasterData\Domain\Repository\PaymentMethodRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\PaymentMethodModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentPaymentMethodRepository extends BaseEloquentRepository implements PaymentMethodRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new PaymentMethodModel());
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }

    public function findById(string $id): object
    {
        return $this->model->with('paymentMethodType')->findOrFail($id);
    }
}
