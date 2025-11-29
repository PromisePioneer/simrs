<?php

namespace App\Http\Controllers\Api\Master\General\RegistrationInstitution;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegistrationInstitutionRequest;
use App\Models\RegistrationInstitution;
use App\Services\Master\General\RegistrationInstitution\Service\RegistrationInstitutionService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class RegistrationInstitutionController extends Controller
{

    use ApiResponse;

    private RegistrationInstitutionService $registrationInstitutionService;

    public function __construct()
    {
        $this->registrationInstitutionService = new RegistrationInstitutionService();
    }

    public function index(Request $request)
    {
        $this->authorize('view', RegistrationInstitution::class);
        $data = $this->registrationInstitutionService->getAllInstitutes($request);
        return response()->json($data);
    }


    public function store(RegistrationInstitutionRequest $request)
    {
        $this->authorize('create', RegistrationInstitution::class);
        $data = $this->registrationInstitutionService->getAllInstitutes($request);
        return $this->successResponse($data, 'Registration institution created successfully.');
    }


    public function show(RegistrationInstitution $registrationInstitution)
    {
        $this->authorize('view', $registrationInstitution);
        return response()->json($registrationInstitution);
    }


    public function update(RegistrationInstitutionRequest $request, RegistrationInstitution $registrationInstitution)
    {
        $this->authorize('update', $registrationInstitution);
        $data = $this->registrationInstitutionService->update($registrationInstitution->id, $request);
        return $this->successResponse($data, 'Registration institution updated successfully.');
    }


    public function destroy(RegistrationInstitution $registrationInstitution)
    {
        $this->authorize('delete', $registrationInstitution);
        $data = $this->registrationInstitutionService->destroy($registrationInstitution->id);
        return $this->successResponse($data, 'Registration institution deleted successfully.');
    }
}
