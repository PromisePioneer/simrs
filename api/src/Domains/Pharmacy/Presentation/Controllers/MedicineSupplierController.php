<?php

namespace Domains\Pharmacy\Presentation\Controllers;

use Domains\Pharmacy\Application\Services\MedicineSupplierService;
use Domains\Pharmacy\Presentation\Policies\MedicineSupplierPolicy;
use Domains\Pharmacy\Presentation\Requests\MedicineSupplierRequest;
use Domains\Pharmacy\Presentation\Resources\MedicineSupplierResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class MedicineSupplierController extends BaseCrudController
{
    protected string $resourceClass = MedicineSupplierResource::class;
    protected ?string $policyClass = MedicineSupplierPolicy::class;

    public function __construct(MedicineSupplierService $service)
    {
        parent::__construct($service);
    }

    public function store(MedicineSupplierRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request);
        return response()->json(new MedicineSupplierResource($result), 201);
    }

    public function update(MedicineSupplierRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($request, $id);
        return response()->json(new MedicineSupplierResource($result), 201);
    }

}
