<?php

namespace App\Services\Master\General\PaymentMethod\Repository;

use App\Models\PaymentMethod;
use App\Services\Master\General\PaymentMethod\Interface\PaymentMethodRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PaymentMethodRepository implements PaymentMethodRepositoryInterface
{
    private PaymentMethod $model;

    public function __construct()
    {
        $this->model = new PaymentMethod();
    }

    public function getAllPaymentMethods(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->with('paymentMethodType')->orderBy('name');

        if (!empty($filters['search'])) {
            $query->whereHas('paymentMethodType', function ($query) use ($filters) {
                $query->where(DB::raw('LOWER(name)'), 'like', '%' . strtolower($filters['search']) . '%');
            })->orWhere(DB::raw('LOWER(name)'), 'like', '%' . strtolower($filters['search']) . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): ?object
    {
        return $this->model->with('paymentMethodType')->findOrFail($id);
    }

    public function store(array $data = []): ?object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): ?object
    {
        $paymentMethods = $this->model->findOrFail($id);
        $paymentMethods->fill($data);
        $paymentMethods->save();
        return $paymentMethods->fresh();
    }

    public function destroy(string $id): ?object
    {
        $paymentMethods = $this->model->findOrFail($id);
        $paymentMethods->delete();
        return $paymentMethods;
    }
}
