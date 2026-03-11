<?php

namespace App\Http\Controllers\Api\Facilities\Room;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoomTypeRequest;
use App\Models\RoomType;
use App\Services\Facilities\Room\Service\RoomTypeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomTypeController extends Controller

{
    use ApiResponse;

    protected RoomTypeService $roomTypeService;

    public function __construct()
    {
        $this->roomTypeService = new RoomTypeService();
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', RoomType::class);
        $data = $this->roomTypeService->getRoomTypes(request: $request);
        return response()->json($data);
    }

    public function store(RoomTypeRequest $request): JsonResponse
    {
        $this->authorize('create', RoomType::class);
        $data = $this->roomTypeService->store(request: $request);

        return $this->successResponse(data: $data, message: 'Room Type successfully saved.');
    }

    public function show(RoomType $roomType): JsonResponse
    {
        $this->authorize('view', $roomType);
        return response()->json($roomType);
    }

    public function update(RoomTypeRequest $request, RoomType $roomType): JsonResponse
    {
        $this->authorize('update', $roomType);
        $data = $this->roomTypeService->update(request: $request, roomType: $roomType);
        return $this->successResponse(data: $data, message: 'Room Type successfully updated.');
    }

    public function destroy(RoomType $roomType): JsonResponse
    {
        $this->authorize('delete', $roomType);
        $data = $this->roomTypeService->destroy($roomType);
        return $this->successResponse(data: $data, message: 'Room Type successfully deleted.');
    }
}
