<?php

namespace App\Services\Payment\Order\Repository;

use App\Models\SubscriptionPayment;
use App\Services\Payment\Order\Interface\PaymentRepositoryInterface;

class PaymentRepository implements PaymentRepositoryInterface
{
    private SubscriptionPayment $model;

    public function __construct()
    {
        $this->model = new SubscriptionPayment();
    }

    public function store(array $data = []): object
    {
        return $this->model->query()->create($data);
    }

}
