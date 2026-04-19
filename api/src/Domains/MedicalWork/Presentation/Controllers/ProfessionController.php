<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Profession;
use App\Traits\ApiResponse;
use Domains\MedicalWork\Application\Services\ProfessionService;
use Domains\MedicalWork\Presentation\Requests\ProfessionRequest;
use Domains\MedicalWork\Presentation\Resources\ProfessionResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class ProfessionController extends BaseCrudController
{
    protected string  $resourceClass = ProfessionResource::class;
    protected ?string $policyClass   = Profession::class;

    public function __construct(ProfessionService $service)
    {
        parent::__construct($service);
    }

    public function store(ProfessionRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new ProfessionResource($result), 201);
    }

    public function update(ProfessionRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($request->validated(), $id);
        return response()->json(new ProfessionResource($result));
    }
}
