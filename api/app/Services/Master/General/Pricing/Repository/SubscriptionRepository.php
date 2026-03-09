<?php

namespace App\Services\Master\General\Pricing\Repository;

use App\Models\Subscription;
use App\Services\Master\General\Pricing\Interface\SubscriptionRepositoryInterface;

class SubscriptionRepository implements SubscriptionRepositoryInterface
{
    private Subscription $model;

    public function __construct()
    {
        $this->model = new Subscription();
    }


    public function baseQuery(array $filters = []): object
    {
        $query = $this->model->with(['plan', 'tenant'])->orderBy('created_at');

        if (!empty($filters['search'])) {
            $query->whereHas('plan', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            })->orWhereHas('tenant', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query;
    }

    public function getAll(array $filters = [], ?int $perPage = null)
    {
        return $perPage ? $this->baseQuery($filters)->paginate($perPage) : $this->baseQuery($filters)->get();
    }


    public function activeTenantSubs(?string $tenantId): ?object
    {
        return $this->model->where('tenant_id', $tenantId)->where('status', 'active');
    }


    public function assignSubs(array $data): object
    {
        $checkActiveSubs = $this->activeTenantSubs(tenantId: $data['tenant_id'])->exists();

        if ($checkActiveSubs) {
            $this->activeTenantSubs($data['tenant_id'])
                ->first()
                ->update(['status' => 'cancelled']);
        }

        return $this->model->create($data);
    }


    #TODO : ARRAY DATA IS REQUIRED, JUST Make it empty because i'm testing some methods
    public function store(array $data = [])
    {
        return $this->model->create($data);
    }
}
