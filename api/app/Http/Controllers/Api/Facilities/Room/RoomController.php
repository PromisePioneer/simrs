<?php

namespace App\Http\Controllers\Api\Facilities\Room;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoomRequest;
use App\Models\Room;
use App\Services\Facilities\Room\Service\RoomService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    use ApiResponse;

    protected RoomService $roomService;

    public function __construct()
    {
        $this->roomService = new RoomService();
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', Room::class);
        $data = $this->roomService->getRooms(request: $request);
        return response()->json($data);
    }


    public function store(RoomRequest $request): JsonResponse
    {
        $this->authorize('create', Room::class);
        $data = $this->roomService->store(request: $request);
        return $this->successResponse(data: $data, message: "Room successfully created");
    }


    public function show(Room $room): JsonResponse
    {
        $this->authorize('view', $room);

        $room->load(['roomType', 'ward']);


        $stats = [
            'total' => $room->beds()->count(),
            'available' => $room->beds()->where('status', 'available')->count(),
            'occupied' => $room->beds()->where('status', 'occupied')->count(),
        ];

        $beds = $room->beds()
            ->with('bedAssignments.inpatientAdmission.patient')
            ->paginate(5);

        return response()->json([
            'room' => $room,
            'beds' => $beds,
            'stats' => $stats,
        ]);
    }

    public function update(RoomRequest $request, Room $room): JsonResponse
    {
        $this->authorize('update', $room);
        $data = $this->roomService->update(request: $request, room: $room);
        return $this->successResponse(data: $data, message: "Room successfully updated");
    }


    public function destroy(Room $room): JsonResponse
    {
        $this->authorize('delete', $room);
        $data = $this->roomService->destroy($room);
        return $this->successResponse(data: $data, message: "Room successfully deleted");
    }
}
