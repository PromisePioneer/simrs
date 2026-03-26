<?php

declare(strict_types=1);

namespace Domains\Tenant\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Tenant\Application\Services\TenantService;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Domains\Tenant\Infrastructure\Services\TenantContext;
use Domains\Tenant\Presentation\Requests\TenantRequest;
use Domains\Tenant\Presentation\Resources\TenantResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class TenantController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly TenantService $tenantService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tenants = $this->tenantService->getTenants(request: $request);

        return response()->json($tenants);
    }

    /**
     * @throws Throwable
     */
    public function store(TenantRequest $request): JsonResponse
    {
        $tenant = $this->tenantService->store(request: $request);

        return $this->successResponse(
            new TenantResource($tenant),
            'Tenant created successfully',
            201
        );
    }

    public function show(TenantModel $tenant): JsonResponse
    {
        return response()->json(new TenantResource($tenant->load(['npwpProvince', 'npwpDistrict'])));
    }

    /**
     * @throws Throwable
     */
    public function update(TenantRequest $request, TenantModel $tenant): JsonResponse
    {
        $updated = $this->tenantService->update(request: $request, tenant: $tenant);

        return $this->successResponse(
            new TenantResource($updated),
            'Tenant updated successfully'
        );
    }

    public function destroy(TenantModel $tenant): JsonResponse
    {
        $tenant->delete();

        return response()->json(['message' => 'Tenant deleted successfully.']);
    }

    public function switchTenant(Request $request): JsonResponse
    {
        $this->tenantService->switchTenant(request: $request);

        return response()->json([
            'success' => true,
            'message' => 'Tenant switched successfully',
        ]);
    }

    public function resetTenant(): JsonResponse
    {
        $this->tenantService->resetTenant();

        return response()->json([
            'success' => true,
            'message' => 'Tenant reset successfully',
        ]);
    }
}
