<?php

namespace Domains\MasterData\Persentation\Controllers;

use Domains\MasterData\Application\Services\DistrictService;
use Domains\MasterData\Persentation\Policies\DistrictPolicy;
use Domains\MasterData\Persentation\Requests\DistrictRequest;
use Domains\MasterData\Persentation\Resources\DistrictResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class DistrictController extends BaseCrudController
{
    protected string $resourceClass = DistrictResource::class;
    protected ?string $policyClass = DistrictPolicy::class;


    public function __construct(DistrictService $service)
    {
        parent::__construct($service);
    }


    public function store(DistrictRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new DistrictResource($result), 201);
    }

    public function update(DistrictRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new DistrictResource($result));
    }


}
