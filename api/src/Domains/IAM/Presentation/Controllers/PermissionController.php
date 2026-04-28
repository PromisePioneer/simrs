<?php

declare(strict_types=1);

namespace Domains\IAM\Presentation\Controllers;

use Domains\IAM\Infrastructure\Persistence\Models\PermissionModel;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Domains\IAM\Presentation\Policies\PermissionPolicy;
use Domains\IAM\Presentation\Policies\RolePolicy;
use Domains\IAM\Presentation\Requests\PermissionRequest;
use Domains\IAM\Presentation\Resources\PermissionResource;
use Domains\MasterData\Application\Services\PermissionService;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class PermissionController extends BaseCrudController
{
    protected string $resourceClass = PermissionResource::class;
    protected ?string $policyClass = RolePolicy::class;
    protected ?string $modelClass = RoleModel::class;

    public function __construct(PermissionService $service)
    {
        parent::__construct($service);
    }

    public function store(PermissionRequest $request): JsonResponse
    {
        $this->authorize('create', $this->modelClass);
        $result = $this->service->store($request->validated());
        return response()->json(new PermissionResource($result), 201);
    }

    public function update(PermissionRequest $request, string $permission): JsonResponse
    {
        $this->authorize('update', $this->modelClass);
        $result = $this->service->update($permission, $request->validated());
        return response()->json(new PermissionResource($result));
    }
}
