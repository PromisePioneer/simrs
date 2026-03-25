<?php

namespace Domains\MasterData\Persentation\Controllers;

use App\Services\Master\General\Region\Regency\Service\RegencyService;
use Domains\MasterData\Persentation\Policies\RegencyPolicy;
use Domains\MasterData\Persentation\Requests\RegencyRequest;
use Domains\MasterData\Persentation\Resources\RegencyResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class RegencyController extends BaseCrudController
{
    protected string $resourceClass = RegencyResource::class;
    protected ?string $policyClass = RegencyPolicy::class;


    public function __construct(RegencyService $service)
    {
        parent::__construct($service);
    }


    public function store(RegencyRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new RegencyResource($result), 201);
    }

    public function update(RegencyRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new RegencyResource($result));
    }
}
