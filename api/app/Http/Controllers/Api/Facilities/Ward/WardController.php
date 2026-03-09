<?php

namespace App\Http\Controllers\Api\Facilities\Ward;

use App\Http\Controllers\Controller;
use App\Http\Requests\WardRequest;
use App\Models\Ward;
use App\Services\Facilities\Ward\Service\WardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WardController extends Controller
{
    use ApiResponse;

    protected WardService $wardService;

    public function __construct()
    {
        $this->wardService = new WardService();
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', Ward::class);
        $data = $this->wardService->getWards(request: $request);
        return response()->json($data);
    }

    public function store(WardRequest $request): JsonResponse
    {
        $this->authorize('create', Ward::class);
        $data = $this->wardService->store(request: $request);
        return $this->successResponse(data: $data, message: 'Ward added successfully.');
    }

    public function show(Ward $ward): JsonResponse
    {
        $this->authorize('view', $ward);
        $ward->load('building');
        return response()->json($ward);
    }

    public function update(WardRequest $request, Ward $ward): JsonResponse
    {
        $this->authorize('update', Ward::class);
        $data = $this->wardService->update(request: $request, ward: $ward);
        return $this->successResponse(data: $data, message: 'Ward updated successfully.');
    }

    public function destroy(Ward $ward): JsonResponse
    {
        $this->authorize('delete', Ward::class);
        $this->wardService->destroy(ward: $ward);
        return $this->successResponse(data: $ward, message: 'Ward deleted successfully.');
    }
}
