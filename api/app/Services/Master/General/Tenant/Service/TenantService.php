<?php

namespace App\Services\Master\General\Tenant\Service;

use App\Http\Requests\TenantRequest;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Services\Master\General\Tenant\Repository\TenantRepository;
use App\Services\Tenant\TenantContext;
use Exception;
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
        return $this->tenantRepository->getTenants(filters: $filters, perPage: $perPage);
    }

    /**
     * @throws Throwable
     */
    public function store(TenantRequest $request): Tenant
    {
        return DB::transaction(function () use ($request) {
            $data         = $request->validated();
            $data['code'] = now()->format('YmdHis');

            $tenant = $this->tenantRepository->store(data: $data);

            // ✅ Auto-assign Free plan supaya tenant tidak langsung
            // kena block CheckTenantSubscription setelah register
            $freePlan = Plan::where('slug', 'free')->first();

            if ($freePlan) {
                Subscription::create([
                    'tenant_id'     => $tenant->id,
                    'plan_id'       => $freePlan->id,
                    'status'        => 'active',
                    'starts_at'     => now(),
                    'ends_at'       => now()->addYears(99),
                    'trial_ends_at' => null,
                    'cancelled_at'  => null,
                ]);
            }

            return $tenant;
        });
    }

    /**
     * @throws Throwable
     */
    public function update($request, $tenant): Tenant
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
}
