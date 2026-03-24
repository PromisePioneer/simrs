<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Controllers;

use Domains\IAM\Application\Services\RoleService;
use Domains\IAM\Presentation\Policies\RolePolicy;
use Domains\IAM\Presentation\Requests\RoleRequest;
use Domains\IAM\Presentation\Resources\RoleResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class RoleController extends BaseCrudController
{
    protected string $resourceClass = RoleResource::class;
    protected ?string $policyClass = RolePolicy::class;


    public function __construct(RoleService $service)
    {
        parent::__construct($service);
    }


    public function store(RoleRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new RoleResource($result));
    }


    public function update(RoleRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($id, $request->validated());
        return response()->json(new RoleResource($result));
    }


    /**
     * GET /roles/tenant/{tenant}
     * Ambil semua role milik tenant tertentu.
     */
    public function getByTenant(string $tenant): JsonResponse
    {
        $this->authorize('view', $this->policyClass);
        $roles = $this->service->getByTenant($tenant);
        return response()->json(RoleResource::collection($roles));
    }
}
