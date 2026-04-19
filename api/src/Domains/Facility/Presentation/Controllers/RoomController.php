<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Facility\Application\Services\RoomService;
use Domains\Facility\Infrastructure\Persistence\Models\RoomModel;
use Domains\Facility\Presentation\Requests\RoomRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class RoomController extends Controller
{
    use ApiResponse;

    public function __construct(private RoomService $roomService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', RoomModel::class);
        $data = $this->roomService->getRooms(request: $request);
        return response()->json($data);
    }

    /** @throws Throwable */
    public function store(RoomRequest $request): JsonResponse
    {
        $this->authorize('create', RoomModel::class);
        $data = $this->roomService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Room successfully created');
    }

    public function show(RoomModel $room): JsonResponse
    {
        $this->authorize('view', $room);
        $room->load(['roomType', 'ward']);

        $stats = [
            'total'    => $room->beds()->count(),
            'available' => $room->beds()->where('status', 'available')->count(),
            'occupied'  => $room->beds()->where('status', 'occupied')->count(),
        ];

        $beds = $room->beds()
            ->with('bedAssignments.inpatientAdmission.patient')
            ->paginate(5);

        return response()->json(['room' => $room, 'beds' => $beds, 'stats' => $stats]);
    }

    public function update(RoomRequest $request, RoomModel $room): JsonResponse
    {
        $this->authorize('update', $room);
        $data = $this->roomService->update(data: $request->validated(), room: $room);
        return $this->successResponse(data: $data, message: 'Room successfully updated');
    }

    public function destroy(RoomModel $room): JsonResponse
    {
        $this->authorize('delete', $room);
        $data = $this->roomService->destroy(room: $room);
        return $this->successResponse(data: $data, message: 'Room successfully deleted');
    }
}
