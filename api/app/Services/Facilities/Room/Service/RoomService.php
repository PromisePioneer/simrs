<?php

namespace App\Services\Facilities\Room\Service;

use App\Http\Requests\RoomRequest;
use App\Models\Room;
use App\Models\RoomType;
use App\Services\Facilities\Bed\Repository\BedRepository;
use App\Services\Facilities\Bed\Service\BedService;
use App\Services\Facilities\Room\Repository\RoomRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class RoomService
{
    protected RoomRepository $roomRepository;
    protected BedService $bedService;

    protected BedRepository $bedRepository;

    public function __construct()
    {
        $this->roomRepository = new RoomRepository();
        $this->bedService = new BedService();
        $this->bedRepository = new BedRepository();
    }


    public function getRooms(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');

        return $this->roomRepository->getRooms(filters: $filters, perPage: $perPage);
    }


    /**
     * @throws Throwable
     */
    public function store(RoomRequest $request): object
    {

        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            $capacity = RoomType::find($data['room_type_id'])->first()?->capacity || $data['capacity'];
            $data['capacity'] = $capacity;
            $room = $this->roomRepository->store($data);

            for ($i = 0; $i <= $room->capacity; $i++) {
                $this->bedRepository->store([
                    'room_id' => $room->id,
                    'bed_number' => $this->bedService->generateBedNumber(roomId: $room->id),
                ]);
            }


            return $room;
        });
    }


    public function update(RoomRequest $request, Room $room): object
    {
        $data = $request->validated();
        return $this->roomRepository->update(id: $room->id, data: $data);
    }


    public function destroy(Room $room): object
    {
        return $this->roomRepository->destroy(id: $room->id);
    }

}
