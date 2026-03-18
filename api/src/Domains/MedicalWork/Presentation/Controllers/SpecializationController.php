<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\MedicalWork\Application\Services\SpecializationService;
use Domains\MedicalWork\Presentation\Requests\SpecializationRequest;
use Domains\MedicalWork\Presentation\Resources\SpecializationResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SpecializationController extends BaseCrudController
{
    protected string $resourceClass = SpecializationResource::class;

    public function __construct(private readonly SpecializationService $specializationService)
    {
        parent::__construct($specializationService);
    }

    public function store(SpecializationRequest $request): JsonResponse
    {
        $result = $this->specializationService->store($request->validated());
        return response()->json(new SpecializationResource($result), 201);
    }

    public function update(SpecializationRequest $request, string $id): JsonResponse
    {
        $result = $this->specializationService->update($request->validated(), $id);
        return response()->json(new SpecializationResource($result));
    }

    /** GET /specializations/professions/{professionId} */
    public function getByProfession(Request $request, string $professionId): JsonResponse
    {
        $result = $this->specializationService->getByProfession($professionId, $request);
        return response()->json(SpecializationResource::collection($result));
    }
}
