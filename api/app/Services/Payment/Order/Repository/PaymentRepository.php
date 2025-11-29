<?php

namespace App\Services\Payment\Order\Repository;

use App\Models\Payment;
use App\Services\Payment\Order\Interface\PaymentRepositoryInterface;

class PaymentRepository implements PaymentRepositoryInterface
{
    private Payment $model;

    public function __construct()
    {
        $this->model = new Payment();
    }

    public function store(array $data = []): object
    {
        return $this->model->query()->create($data);
    }

}
