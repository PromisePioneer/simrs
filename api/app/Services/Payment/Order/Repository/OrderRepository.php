<?php

namespace App\Services\Payment\Order\Repository;

use App\Models\Order;
use App\Services\Payment\Order\Interface\OrderRepositoryInterface;

class OrderRepository implements OrderRepositoryInterface
{
    protected Order $model;

    public function __construct()
    {
        $this->model = new Order();
    }


    public function getValidByTenantId(string $tenantId): ?object
    {
        return $this->model->where('tenant_id', $tenantId)
            ->where('expires_at', '>', now())
            ->latest()->first();
    }


    public function findByOrderNumber(string $orderNumber): ?object
    {
        return $this->model->where('order_number', $orderNumber)->first();
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }


}
