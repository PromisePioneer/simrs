<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Facility\Application\Services\BedService;
use Domains\Facility\Infrastructure\Persistence\Models\BedModel;
use Domains\Facility\Presentation\Requests\BedRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BedController extends Controller
{
    use ApiResponse;

    public function __construct(private BedService $bedService) {}

    public function index(Request $request): JsonResponse
    {
        $data = $this->bedService->getBeds(request: $request);
        return response()->json($data);
    }

    public function store(BedRequest $request): JsonResponse
    {
        $data = $this->bedService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'data successfully created');
    }

    public function show(BedModel $bed): JsonResponse
    {
        $bed->load('room');
        return response()->json($bed);
    }

    public function update(BedRequest $request, BedModel $bed): JsonResponse
    {
        $data = $this->bedService->update(data: $request->validated(), bed: $bed);
        return $this->successResponse(data: $data, message: 'data successfully updated');
    }

    public function destroy(BedModel $bed): JsonResponse
    {
        $data = $this->bedService->destroy(bed: $bed);
        return $this->successResponse(data: $data, message: 'data successfully deleted');
    }
}
