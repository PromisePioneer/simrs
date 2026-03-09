<?php

namespace App\Services\Master\General\PaymentMethod\Repository;

use App\Models\PaymentMethodType;
use App\Services\Master\General\PaymentMethod\Interface\PaymentMethodTypeRepositoryInterface;

class PaymentMethodTypeRepository implements PaymentMethodTypeRepositoryInterface
{

    private PaymentMethodType $model;

    public function __construct()
    {
        $this->model = new PaymentMethodType();
    }

    public function getAllPaymentMethodTypes(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): ?object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data = []): ?object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data = []): ?object
    {
        $paymentMethodType = $this->model->findOrFail($id);
        $paymentMethodType->fill($data);
        $paymentMethodType->save();
        return $paymentMethodType->fresh();
    }

    public function destroy(string $id): ?object
    {
        $paymentMethodType = $this->model->findOrFail($id);
        $paymentMethodType->delete();
        return $paymentMethodType;
    }
}
