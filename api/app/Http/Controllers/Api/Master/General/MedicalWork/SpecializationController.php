<?php

namespace App\Http\Controllers\Api\Master\General\MedicalWork;

use App\Http\Controllers\Controller;
use App\Http\Requests\SpecializationRequest;
use App\Models\Profession;
use App\Models\Specialization;
use App\Services\Master\General\MedicalWork\Service\SpecializationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SpecializationController extends Controller
{

    use ApiResponse;

    private SpecializationService $specializationService;

    public function __construct()
    {
        $this->specializationService = new SpecializationService();
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->specializationService->getSpecialization($request);
        return response()->json($data);
    }


    public function store(SpecializationRequest $request): JsonResponse
    {
        $this->authorize('create', Specialization::class);
        $data = $this->specializationService->store($request);
        return $this->successResponse($data, 'sub specialization created successfully.');
    }


    public function show(Specialization $subSpecialization): JsonResponse
    {
        $this->authorize('view', $subSpecialization);
        $subSpecialization->load('subSpecializations');
        return response()->json($subSpecialization);
    }

    public function getByProfession(Request $request, Profession $profession): JsonResponse
    {
        $data = $this->specializationService->getByProfessionId($request, $profession);
        return response()->json($data);
    }

    public function update(SpecializationRequest $request, Specialization $specialization): JsonResponse
    {
        $this->authorize('update', $specialization);
        $data = $this->specializationService->update($request, $specialization->id);
        return $this->successResponse($data, 'sub specialization updated successfully.');
    }


    public function destroy(Specialization $specialization): JsonResponse
    {
        $this->authorize('delete', $specialization);
        $this->specializationService->destroy($specialization->id);
        return $this->successResponse(null, 'sub specialization deleted successfully.');
    }
}
