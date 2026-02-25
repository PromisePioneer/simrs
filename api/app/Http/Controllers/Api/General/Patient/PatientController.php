<?php

namespace App\Http\Controllers\Api\General\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use App\Services\Master\General\Patient\Service\PatientService;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PatientController extends Controller
{

    use ApiResponse;

    protected PatientService $patientService;

    public function __construct()
    {
        $this->patientService = new  PatientService();
    }

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', Patient::class);
        return response()->json($this->patientService->getPatients($request));
    }


    /**
     * @throws Throwable
     */
    public function store(PatientRequest $patientRequest): JsonResponse
    {
        $patient = $this->patientService->store($patientRequest);
        return $this->successResponse($patient);
    }


    public function show(Patient $patient): JsonResponse
    {
        $patient->load([
            'paymentMethods',
            'addresses'
        ]);
        return response()->json($patient);
    }


    /**
     * @throws Throwable
     */
    public function update(PatientRequest $request, Patient $patient): JsonResponse
    {
        $patient = $this->patientService->update($request, $patient);
        return $this->successResponse($patient);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();
        return $this->successResponse($patient);
    }

    public function emr(Request $request): JsonResponse
    {
        $data = $this->patientService->getPatientWithEMR(request: $request);
        return response()->json($data);
    }
}
