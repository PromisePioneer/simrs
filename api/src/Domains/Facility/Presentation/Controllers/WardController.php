<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Facility\Application\Services\WardService;
use Domains\Facility\Infrastructure\Persistence\Models\WardModel;
use Domains\Facility\Presentation\Requests\WardRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WardController extends Controller
{
    use ApiResponse;

    public function __construct(private WardService $wardService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', WardModel::class);
        $data = $this->wardService->getWards(request: $request);
        return response()->json($data);
    }

    public function store(WardRequest $request): JsonResponse
    {
        $this->authorize('create', WardModel::class);
        $data = $this->wardService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Ward added successfully.');
    }

    public function show(WardModel $ward): JsonResponse
    {
        $this->authorize('view', $ward);
        $ward->load(['building', 'rooms', 'department']);
        return response()->json($ward);
    }

    public function update(WardRequest $request, WardModel $ward): JsonResponse
    {
        $this->authorize('update', WardModel::class);
        $data = $this->wardService->update(data: $request->validated(), ward: $ward);
        return $this->successResponse(data: $data, message: 'Ward updated successfully.');
    }

    public function destroy(WardModel $ward): JsonResponse
    {
        $this->authorize('delete', WardModel::class);
        $this->wardService->destroy(ward: $ward);
        return $this->successResponse(data: $ward, message: 'Ward deleted successfully.');
    }
}
