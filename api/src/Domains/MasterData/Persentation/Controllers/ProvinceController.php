<?php

namespace Domains\MasterData\Persentation\Controllers;

use Domains\MasterData\Application\Services\ProvinceService;
use Domains\MasterData\Persentation\Policies\ProvincePolicy;
use Domains\MasterData\Persentation\Requests\ProvinceRequest;
use Domains\MasterData\Persentation\Resources\ProvinceResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class ProvinceController extends BaseCrudController
{
    protected string $resourceClass = ProvinceResource::class;
    protected ?string $policyClass = ProvincePolicy::class;


    public function __construct(ProvinceService $service)
    {
        parent::__construct($service);
    }


    public function store(ProvinceRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new ProvinceResource($result), 201);    }

    public function update(ProvinceRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new ProvinceResource($result));
    }
}
