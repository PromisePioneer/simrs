<?php

namespace Domains\MasterData\Persentation\Controllers;

use Domains\MasterData\Application\Services\DiseaseService;
use Domains\MasterData\Persentation\Policies\DiseasePolicy;
use Domains\MasterData\Persentation\Requests\DiseaseRequest;
use Domains\MasterData\Persentation\Resources\DiseaseResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class DiseaseController extends BaseCrudController
{
    protected string $resourceClass = DiseaseResource::class;
    protected ?string $policyClass = DiseasePolicy::class;


    public function __construct(DiseaseService $service)
    {
        parent::__construct($service);
    }

    public function store(DiseaseRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new DiseaseResource($result), 201);
    }


    public function update(DiseaseRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($id, $request->validated());
        return response()->json(new DiseaseResource($result));
    }
}
