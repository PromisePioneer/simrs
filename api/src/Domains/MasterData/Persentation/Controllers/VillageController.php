<?php

namespace Domains\MasterData\Persentation\Controllers;

use App\Services\Master\General\Region\Village\Service\VillageService;
use Domains\MasterData\Persentation\Policies\VillagePolicy;
use Domains\MasterData\Persentation\Requests\VillageRequest;
use Domains\MasterData\Persentation\Resources\VillageResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class VillageController extends BaseCrudController
{
    protected string $resourceClass = VillageResource::class;
    protected ?string $policyClass = VillagePolicy::class;


    public function __construct(VillageService $service)
    {
        parent::__construct($service);
    }


    public function store(VillageRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new VillageResource($result), 201);
    }

    public function update(VillageRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new VillageResource($result));
    }
}
