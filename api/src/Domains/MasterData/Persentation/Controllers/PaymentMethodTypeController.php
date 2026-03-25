<?php

declare(strict_types=1);

namespace Domains\MasterData\Persentation\Controllers;

use Domains\MasterData\Application\Services\PaymentMethodTypeService;
use Domains\MasterData\Persentation\Policies\PaymentMethodTypePolicy;
use Domains\MasterData\Persentation\Requests\PaymentMethodTypeRequest;
use Domains\MasterData\Persentation\Resources\PaymentMethodTypeResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class PaymentMethodTypeController extends BaseCrudController
{
    protected string $resourceClass  = PaymentMethodTypeResource::class;
    protected ?string $policyClass   = PaymentMethodTypePolicy::class;

    public function __construct(PaymentMethodTypeService $service)
    {
        parent::__construct($service);
    }

    public function store(PaymentMethodTypeRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new PaymentMethodTypeResource($result), 201);
    }

    public function update(PaymentMethodTypeRequest $request, string $paymentMethodType): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($paymentMethodType, $request->validated());
        return response()->json(new PaymentMethodTypeResource($result));
    }
}
