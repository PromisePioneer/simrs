<?php

namespace App\Services\Facilities\Bed\Service;

use App\Http\Requests\BedRequest;
use App\Models\Bed;
use App\Services\Facilities\Bed\Repository\BedRepository;
use App\Services\Facilities\Room\Repository\RoomRepository;
use Illuminate\Http\Request;

class BedService
{

    protected BedRepository $bedRepository;

    protected RoomRepository $roomRepository;

    public function __construct()
    {
        $this->bedRepository = new BedRepository();
        $this->roomRepository = new RoomRepository();
    }


    public function getBeds(Request $request): object
    {
        $filters = $request->only(['search', 'status']);
        $perPage = $request->input('perPage');
        return $this->bedRepository->getBeds(filters: $filters, perPage: $perPage);
    }


    public function store(BedRequest $request): object
    {
        $data = $request->validated();
        return $this->bedRepository->store(data: $data);
    }


    public function update(BedRequest $request, Bed $bed): object
    {
        $data = $request->validated();
        return $this->bedRepository->update(data: $data, id: $bed->id);
    }


    public function destroy(Bed $bed): object
    {
        return $this->bedRepository->destroy(id: $bed->id);
    }

    public function generateBedNumber($roomId): string
    {
        $room = $this->roomRepository->findById($roomId);

        $count = Bed::where('room_id', $roomId)->count();

        $letter = chr(65 + $count);

        return $room->room_number . '-' . $letter;
    }
}
