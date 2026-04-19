<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Controllers;

use Domains\IAM\Presentation\Policies\PermissionPolicy;
use Domains\IAM\Presentation\Requests\PermissionRequest;
use Domains\IAM\Presentation\Resources\PermissionResource;
use Domains\MasterData\Application\Services\PermissionService;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class PermissionController extends BaseCrudController
{
    protected string $resourceClass = PermissionResource::class;
    protected ?string $policyClass  = PermissionPolicy::class;

    public function __construct(PermissionService $service)
    {
        parent::__construct($service);
    }

    public function store(PermissionRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new PermissionResource($result), 201);
    }

    public function update(PermissionRequest $request, string $permission): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($permission, $request->validated());
        return response()->json(new PermissionResource($result));
    }
}
