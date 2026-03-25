<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use Domains\IAM\Domain\Repository\PaymentMethodTypeRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\PaymentMethodTypeModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentPaymentMethodTypeRepository extends BaseEloquentRepository implements PaymentMethodTypeRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new PaymentMethodTypeModel());
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }
}
