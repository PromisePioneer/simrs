<?php

namespace App\Services\Master\General\Tenant\Service;

use App\Http\Requests\TenantRequest;
use App\Models\Tenant;
use App\Services\Master\General\Tenant\Repository\TenantRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Throwable;

class TenantService
{
    private TenantRepository $tenantRepository;

    public function __construct()
    {
        $this->tenantRepository = new TenantRepository();
    }


    public function getTenants(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->tenantRepository->getTenants($filters, $perPage);
    }

    /**
     * @throws Throwable
     */
    public function store(TenantRequest $request): Tenant
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $data['code'] = now()->format('YmdHis');
            return $this->tenantRepository->store($data);
        });
    }

    /**
     * @throws Throwable
     */
    public function update($request, $tenant): Tenant
    {
        return DB::transaction(function () use ($request, $tenant) {
            $data = $request->validated();
            return $this->tenantRepository->update($data, $tenant->id);
        });
    }
}
