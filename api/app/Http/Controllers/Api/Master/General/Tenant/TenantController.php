<?php

namespace App\Http\Controllers\Api\Master\General\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\TenantRequest;
use App\Models\Tenant;
use App\Services\Master\General\Tenant\Service\TenantService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class TenantController extends Controller
{
    use ApiResponse;

    public function index(Request $request, TenantService $service): JsonResponse
    {
        return response()->json($service->getTenants($request));
    }

    /**
     * @throws Throwable
     */
    public function store(TenantRequest $request, TenantService $service): JsonResponse
    {
        $tenant = $service->store($request);
        return $this->successResponse($tenant, 'Tenant created successfully', 201);
    }


    public function show(Tenant $tenant): JsonResponse
    {
        return response()->json($tenant);
    }

    /**
     * @throws Throwable
     */
    public function update(TenantRequest $request, Tenant $tenant, TenantService $service): JsonResponse
    {
        $tenant = $service->update($request, $tenant);
        return $this->successResponse($tenant, 'Tenant updated successfully');
    }


    public function destroy(Tenant $tenant): JsonResponse
    {
        $tenant->delete();
        return response()->json(['message' => 'Tenant deleted successfully.']);
    }

}
