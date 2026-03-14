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

    public function getValidByTenantId(string $tenantId): ?Order
    {
        return $this->model
            ->where('tenant_id', $tenantId)
            ->whereIn('status', ['pending'])
            ->where('expires_at', '>', now())
            ->with(['plan', 'payment'])
            ->latest()
            ->first();
    }

    public function findByOrderNumber(string $orderNumber): ?Order
    {
        return $this->model->where('order_number', $orderNumber)->first();
    }

    public function store(array $data): Order
    {
        return $this->model->create($data);
    }
}
