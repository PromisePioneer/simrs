<?php

declare(strict_types=1);

namespace Domains\Tenant\Application\Services;

use Domains\Tenant\Domain\Repository\TenantRepositoryInterface;
use Domains\Tenant\Infrastructure\Services\TenantContext;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Throwable;

class TenantService
{
    public function __construct(
        private readonly TenantRepositoryInterface $tenantRepository,
    ) {}

    public function getTenants(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');

        return $this->tenantRepository->getTenants(filters: $filters, perPage: $perPage);
    }

    /**
     * @throws Throwable
     */
    public function store(Request $request): object
    {
        return DB::transaction(function () use ($request) {
            $data         = $request->validated();
            $data['code'] = now()->format('YmdHis');

            $tenant = $this->tenantRepository->store(data: $data);

            // Fire domain event — Payment domain listener (AssignFreePlanOnTenantCreated)
            // picks this up to assign the free plan automatically.
            event(new \Domains\Tenant\Domain\Events\TenantCreated(
                tenantId:   $tenant->id,
                tenantName: $tenant->name,
            ));

            return $tenant;
        });
    }

    /**
     * @throws Throwable
     */
    public function update(Request $request, object $tenant): object
    {
        return DB::transaction(function () use ($request, $tenant) {
            $data = $request->validated();

            return $this->tenantRepository->update(id: $tenant->id, data: $data);
        });
    }

    public function switchTenant(Request $request): array
    {
        try {
            $user = auth()->user();
            abort_unless($user->hasRole('Super Admin'), 403, 'Unauthorized');

            $validated = $request->validate([
                'tenant_id' => 'required|exists:tenants,id',
                'role_id'   => 'required|exists:roles,uuid',
            ]);

            $request->session()->put([
                'active_tenant_id' => $validated['tenant_id'],
                'active_role_id'   => $validated['role_id'],
            ]);

            TenantContext::set($validated['tenant_id']);
            setPermissionsTeamId($validated['tenant_id']);

            return ['message' => 'Tenant switched successfully'];
        } catch (Exception $exception) {
            return ['message' => 'Failed to switch tenant: ' . $exception->getMessage()];
        }
    }

    public function resetTenant(): void
    {
        session()->forget('active_tenant_id');
        session()->forget('active_role_id');
        TenantContext::set(null);
    }
}
