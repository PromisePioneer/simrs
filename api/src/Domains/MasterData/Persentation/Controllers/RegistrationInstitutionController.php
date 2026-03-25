<?php

namespace Domains\MasterData\Persentation\Controllers;

use Domains\MasterData\Application\Services\RegistrationInstitutionService;
use Domains\MasterData\Persentation\Policies\RegistrationInstitutionPolicy;
use Domains\MasterData\Persentation\Requests\RegistrationInstitutionRequest;
use Domains\MasterData\Persentation\Resources\RegistrationInstitutionResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class RegistrationInstitutionController extends BaseCrudController
{
    protected string $resourceClass = RegistrationInstitutionResource::class;
    protected ?string $policyClass = RegistrationInstitutionPolicy::class;


    public function __construct(RegistrationInstitutionService $service)
    {
        parent::__construct($service);
    }


    public function store(RegistrationInstitutionRequest $request): JsonResponse
    {
        $this->authorize('create', $this->policyClass);
        $result = $this->service->store($request->validated());
        return response()->json(new RegistrationInstitutionResource($result));
    }


    public function update(RegistrationInstitutionRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->policyClass);
        $result = $this->service->update($id, $request->validated());
        return response()->json(new RegistrationInstitutionResource($result));
    }
}
