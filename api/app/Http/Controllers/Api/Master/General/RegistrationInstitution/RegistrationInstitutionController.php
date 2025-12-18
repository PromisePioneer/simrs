<?php

namespace App\Http\Controllers\Api\Master\General\RegistrationInstitution;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegistrationInstitutionRequest;
use App\Models\RegistrationInstitution;
use App\Services\Master\General\RegistrationInstitution\Service\RegistrationInstitutionService;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrationInstitutionController extends Controller
{

    use ApiResponse;

    private RegistrationInstitutionService $registrationInstitutionService;

    public function __construct()
    {
        $this->registrationInstitutionService = new RegistrationInstitutionService();
    }


    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', RegistrationInstitution::class);
        $data = $this->registrationInstitutionService->getAllInstitutes($request);
        return response()->json($data);
    }


    /**
     * @throws AuthorizationException
     */
    public function store(RegistrationInstitutionRequest $request): JsonResponse
    {
        $this->authorize('create', RegistrationInstitution::class);
        $data = $this->registrationInstitutionService->getAllInstitutes($request);
        return $this->successResponse($data, 'Registration institution created successfully.');
    }


    /**
     * @throws AuthorizationException
     */

    public function show(RegistrationInstitution $registrationInstitution): JsonResponse
    {
        $this->authorize('view', $registrationInstitution);
        return response()->json($registrationInstitution);
    }


    /**
     * @throws AuthorizationException
     */
    public function update(RegistrationInstitutionRequest $request, RegistrationInstitution $registrationInstitution): JsonResponse
    {
        $this->authorize('update', $registrationInstitution);
        $data = $this->registrationInstitutionService->update($request, $registrationInstitution->id);
        return $this->successResponse($data, 'Registration institution updated successfully.');
    }


    /**
     * @throws AuthorizationException
     */
    public function destroy(RegistrationInstitution $registrationInstitution): JsonResponse
    {
        $this->authorize('delete', $registrationInstitution);
        $data = $this->registrationInstitutionService->destroy($registrationInstitution->id);
        return $this->successResponse($data, 'Registration institution deleted successfully.');
    }
}
