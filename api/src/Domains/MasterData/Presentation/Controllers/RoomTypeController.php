<?php

namespace Domains\MasterData\Presentation\Controllers;

use Domains\MasterData\Application\Services\RoomTypeService;
use Domains\MasterData\Presentation\Policies\RoomTypePolicy;
use Domains\MasterData\Presentation\Requests\RoomTypeRequest;
use Domains\MasterData\Presentation\Resources\RoomTypeResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class RoomTypeController extends BaseCrudController
{
    protected string $resourceClass = RoomTypeResource::class;
    protected ?string $policyClass = RoomTypePolicy::class;


    public function __construct(RoomTypeService $service)
    {
        parent::__construct($service);
    }


    public function store(RoomTypeRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new RoomTypeResource($result));
    }


    public function update(RoomTypeRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($id, $request->validated());
        return response()->json(new RoomTypeResource($result));
    }


}


