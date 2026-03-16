<?php

namespace Domains\IAM\Presentation\Controllers;

use Domains\IAM\Application\Services\PoliService;
use Domains\IAM\Presentation\Policies\PoliPolicy;
use Domains\IAM\Presentation\Requests\PoliRequest;
use Domains\IAM\Presentation\Resources\PoliResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class PaymentMethodController extends BaseCrudController
{
    protected string $resourceClass = PoliResource::class;
    protected ?string $policyClass = PoliPolicy::class;


    public function __construct(PoliService $service)
    {
        parent::__construct($service);
    }

    public function store(PoliRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new PoliResource($result), 201);
    }

    public function update(PoliRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new PoliResource($result));
    }
}
