<?php

namespace Domains\MasterData\Persentation\Controllers;

use Domains\MasterData\Application\Services\PaymentMethodService;
use Domains\MasterData\Persentation\Policies\PaymentMethodPolicy;
use Domains\MasterData\Persentation\Requests\PaymentMethodRequest;
use Domains\MasterData\Persentation\Resources\PaymentMethodResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class PaymentMethodController extends BaseCrudController
{
    protected string $resourceClass = PaymentMethodResource::class;
    protected ?string $policyClass = PaymentMethodPolicy::class;


    public function __construct(PaymentMethodService $service)
    {
        parent::__construct($service);
    }

    public function store(PaymentMethodRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new PaymentMethodResource($result), 201);
    }

    public function update(PaymentMethodRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($id, $request->validated());
        return response()->json(new PaymentMethodResource($result));
    }
}
