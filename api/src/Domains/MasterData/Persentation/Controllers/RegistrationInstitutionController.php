<?php

namespace Domains\MasterData\Persentation\Controllers;

use Domains\MasterData\Application\Services\RegistrationInstitutionService;
use Domains\MasterData\Infrastructure\Persistent\Models\RegistrationInstitutionModel;
use Domains\MasterData\Persentation\Policies\RegistrationInstitutionPolicy;
use Domains\MasterData\Persentation\Requests\RegistrationInstitutionRequest;
use Domains\MasterData\Persentation\Resources\RegistrationInstitutionResource;
use Domains\Shared\Presentation\Controllers\BaseCrudController;
use Illuminate\Http\JsonResponse;

class RegistrationInstitutionController extends BaseCrudController
{
    protected string $resourceClass = RegistrationInstitutionResource::class;
    protected ?string $policyClass = RegistrationInstitutionPolicy::class;
    protected ?string $modelClass = RegistrationInstitutionModel::class;


    public function __construct(RegistrationInstitutionService $service)
    {
        parent::__construct($service);
    }


    public function store(RegistrationInstitutionRequest $request): JsonResponse
    {
        $this->authorize('create', $this->modelClass);
        $result = $this->service->store($request->validated());
        return response()->json(new RegistrationInstitutionResource($result));
    }


    public function update(RegistrationInstitutionRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->modelClass);
        $result = $this->service->update(id: $id, data: $request->validated());
        return response()->json(new RegistrationInstitutionResource($result));
    }
}
