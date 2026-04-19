<?php

namespace App\Services\Payment\Order\Interface;

interface PaymentRepositoryInterface
{
    public function store(array $data = []): object;
}
