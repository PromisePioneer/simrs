<?php

namespace App\Http\Controllers\Api\Master\General\MedicalWork;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfessionRequest;
use App\Models\Profession;
use App\Services\Master\General\MedicalWork\Service\ProfessionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfessionController extends Controller
{
    use ApiResponse;

    private ProfessionService $professionService;

    public function __construct()
    {
        $this->professionService = new ProfessionService();
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', Profession::class);
        $data = $this->professionService->getProfessions($request);
        return response()->json($data);
    }


    public function store(ProfessionRequest $request): JsonResponse
    {
        $this->authorize('create', Profession::class);
        $data = $this->professionService->store($request);
        return $this->successResponse($data, 'Profession created successfully.');
    }


    public function show(Profession $profession): JsonResponse
    {
        $profession->load('specializations');
        return response()->json($profession);
    }

    public function update(ProfessionRequest $request, Profession $profession): JsonResponse
    {
        $this->authorize('update', $profession);
        $data = $this->professionService->update($request, $profession->id);
        return $this->successResponse($data, 'Profession updated successfully.');
    }


    public function destroy(Profession $profession): JsonResponse
    {
        $this->authorize('delete', $profession);
        $this->professionService->destroy($profession->id);
        return $this->successResponse(null, 'Profession deleted successfully.');
    }
}
