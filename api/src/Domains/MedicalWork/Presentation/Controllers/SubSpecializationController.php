<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Controllers;

use Domains\MedicalWork\Application\Services\SubSpecializationService;
use Domains\MedicalWork\Presentation\Requests\SubSpecializationRequest;
use Domains\MedicalWork\Presentation\Resources\SubSpecializationResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubSpecializationController extends BaseCrudController
{
    protected string $resourceClass = SubSpecializationResource::class;

    public function __construct(private readonly SubSpecializationService $subService)
    {
        parent::__construct($subService);
    }

    public function store(SubSpecializationRequest $request): JsonResponse
    {
        $result = $this->subService->store($request->validated());
        return response()->json(new SubSpecializationResource($result), 201);
    }

    public function update(SubSpecializationRequest $request, string $id): JsonResponse
    {
        $result = $this->subService->update($request->validated(), $id);
        return response()->json(new SubSpecializationResource($result));
    }

    /** GET /sub-specializations/specializations/{specializationId} */
    public function getBySpecializations(Request $request, string $specializationId): JsonResponse
    {
        $result = $this->subService->getBySpecialization($specializationId, $request);
        return response()->json(SubSpecializationResource::collection($result));
    }
}
