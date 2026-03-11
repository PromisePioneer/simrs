<?php

namespace App\Services\Facilities\Room\Service;

use App\Http\Requests\RoomRequest;
use App\Models\Room;
use App\Services\Facilities\Room\Repository\RoomRepository;
use Illuminate\Http\Request;

class RoomService
{
    protected RoomRepository $roomRepository;

    public function __construct()
    {
        $this->roomRepository = new RoomRepository();
    }


    public function getRooms(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');

        return $this->roomRepository->getRooms(filters: $filters, perPage: $perPage);
    }


    public function store(RoomRequest $request): object
    {
        $data = $request->validated();
        return $this->roomRepository->store($data);
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
