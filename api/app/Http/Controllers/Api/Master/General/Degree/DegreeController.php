<?php

namespace App\Http\Controllers\Api\Master\General\Degree;

use App\Http\Controllers\Controller;
use App\Http\Requests\DegreeRequest;
use App\Models\Degree;
use App\Services\Master\General\Degree\Service\DegreeService;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DegreeController extends Controller
{

    use ApiResponse;

    private DegreeService $degreeService;

    public function __construct()
    {
        $this->degreeService = new DegreeService();
    }

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', Degree::class);
        $data = $this->degreeService->getDegrees($request);
        return response()->json($data);
    }


    /**
     * @throws AuthorizationException
     */
    public function store(DegreeRequest $request): JsonResponse
    {
        $this->authorize('create', Degree::class);
        $data = $this->degreeService->store($request);
        return $this->successResponse($data, 'Degree added successfully.');
    }


    /**
     * @throws AuthorizationException
     */
    public function show(Degree $degree): JsonResponse
    {
        $this->authorize('view', $degree);
        return response()->json($degree);
    }


    /**
     * @throws AuthorizationException
     */
    public function update(DegreeRequest $request, Degree $degree): JsonResponse
    {
        $this->authorize('update', $degree);
        $data = $this->degreeService->update($request, $degree);
        return $this->successResponse($data, 'Degree updated successfully.');
    }


    /**
     * @throws AuthorizationException
     */
    public function destroy(Degree $degree): JsonResponse
    {
        $this->authorize('update', Degree::class);
        $data = $this->degreeService->destroy($degree);
        return $this->successResponse($data, 'Degree deleted successfully.');
    }

}
