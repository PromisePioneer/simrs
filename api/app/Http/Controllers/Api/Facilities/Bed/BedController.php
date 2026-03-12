<?php

namespace App\Http\Controllers\Api\Facilities\Bed;

use App\Http\Requests\BedRequest;
use App\Models\Bed;
use App\Services\Facilities\Bed\Service\BedService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BedController
{
    use ApiResponse;

    protected BedService $bedService;

    public function __construct()
    {
        $this->bedService = new BedService();
    }


    public function index(Request $request): JsonResponse
    {
        $data = $this->bedService->getBeds(request: $request);
        return response()->json($data);
    }


    public function store(BedRequest $request): JsonResponse
    {
        $data = $this->bedService->store(request: $request);
        return $this->successResponse(data: $data, message: "data successfully created");
    }


    public function show(Bed $bed): JsonResponse
    {
        $bed->load('room');
        return response()->json($bed);
    }


    public function update(BedRequest $request, Bed $bed): JsonResponse
    {
        $data = $this->bedService->update(request: $request, bed: $bed);
        return $this->successResponse(data: $data, message: "data successfully updated");
    }


    public function destroy(Bed $bed): JsonResponse
    {
        $data = $this->bedService->destroy(bed: $bed);
        return $this->successResponse(data: $data, message: "data successfully deleted");
    }

}
