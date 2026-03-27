<?php

declare(strict_types=1);

namespace Domains\MasterData\Persentation\Controllers;

use Domains\MasterData\Application\Services\DepartmentService;
use Domains\MasterData\Persentation\Policies\DepartmentPolicy;
use Domains\MasterData\Persentation\Requests\DepartmentRequest;
use Domains\MasterData\Persentation\Resources\DepartmentResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class DepartmentController extends BaseCrudController
{
    protected string $resourceClass = DepartmentResource::class;
    protected ?string $policyClass = DepartmentPolicy::class;


    public function __construct(DepartmentService $service)
    {
        parent::__construct($service);
    }

    public function store(DepartmentRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new DepartmentResource($result), 201);
    }

    public function update(DepartmentRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new DepartmentResource($result));
    }
}
