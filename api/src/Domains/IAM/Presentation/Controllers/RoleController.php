<?php

namespace Domains\IAM\Presentation\Controllers;

use Domains\IAM\Application\Services\RoleService;
use Domains\IAM\Presentation\Policies\RolePolicy;
use Domains\IAM\Presentation\Requests\RoleRequest;
use Domains\IAM\Presentation\Resources\RegistrationInstitutionResource;
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
        return response()->json(new RegistrationInstitutionResource($result));
    }


    public function update(RoleRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($id, $request->validated());
        return response()->json(new RegistrationInstitutionResource($result));
    }
}
