<?php

namespace App\Http\Controllers\Api\Master\General\MedicalWork;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubSpecializationRequest;
use App\Models\Specialization;
use App\Models\SubSpecialization;
use App\Services\Master\General\MedicalWork\Service\SubSpecializationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubSpecializationController extends Controller
{
    use ApiResponse;

    private SubSpecializationService $subSpecializationService;

    public function __construct()
    {
        $this->subSpecializationService = new SubSpecializationService();
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->subSpecializationService->getSubSpecializations($request);
        return response()->json($data);
    }


    public function getBySpecializations(Request $request, Specialization $specialization): JsonResponse
    {
        $data = $this->subSpecializationService->getBySpecializations($request, $specialization);
        return response()->json($data);
    }


    public function store(SubSpecializationRequest $request): JsonResponse
    {
        $this->authorize('create', SubSpecialization::class);
        $data = $this->subSpecializationService->store($request);
        return $this->successResponse($data, 'sub specialization created successfully.');
    }


    public function show(SubSpecialization $subSpecialization): JsonResponse
    {
        $this->authorize('view', $subSpecialization);
        $subSpecialization->load('specializations');
        return response()->json($subSpecialization);
    }

    public function update(SubSpecializationRequest $request, SubSpecialization $subSpecialization): JsonResponse
    {
        $this->authorize('update', $subSpecialization);
        $data = $this->subSpecializationService->update($request, $subSpecialization->id);
        return $this->successResponse($data, 'sub specialization updated successfully.');
    }


    public function destroy(SubSpecialization $subSpecialization): JsonResponse
    {
        $this->authorize('delete', $subSpecialization);
        $this->subSpecializationService->destroy($subSpecialization->id);
        return $this->successResponse(null, 'sub specialization deleted successfully.');
    }
}
