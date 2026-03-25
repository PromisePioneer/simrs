<?php

declare(strict_types=1);

namespace Domains\MasterData\Persentation\Controllers;

use Domains\MasterData\Application\Services\DegreeService;
use Domains\MasterData\Infrastructure\Persistent\Models\DegreeModel;
use Domains\MasterData\Persentation\Requests\DegreeRequest;
use Domains\MasterData\Persentation\Resources\DegreeResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class DegreeController extends BaseCrudController
{
    protected string $resourceClass = DegreeResource::class;
    protected ?string $policyClass = DegreeModel::class;

    public function __construct(DegreeService $service)
    {
        parent::__construct($service);
    }

    public function store(DegreeRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new DegreeResource($result), 201);
    }

    public function update(DegreeRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new DegreeResource($result));
    }
}
