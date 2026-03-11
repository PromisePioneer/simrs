<?php

namespace App\Services\Facilities\Room\Service;

use App\Http\Requests\RoomTypeRequest;
use App\Models\RoomType;
use App\Services\Facilities\Room\Repository\RoomTypeRepository;
use Illuminate\Http\Request;

class RoomTypeService
{


    protected RoomTypeRepository $roomTypeRepository;


    public function __construct()
    {
        $this->roomTypeRepository = new RoomTypeRepository();
    }


    public function getRoomTypes(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->integer('per_page');
        return $this->roomTypeRepository->getRoomTypes(filters: $filters, perPage: $perPage);
    }


    public function store(RoomTypeRequest $request): object
    {
        $data = $request->validated();
        return $this->roomTypeRepository->store(data: $data);
    }


    public function update(RoomTypeRequest $request, RoomType $roomType): object
    {
        $data = $request->validated();
        return $this->roomTypeRepository->update(id: $roomType->id, data: $data);
    }


    public function destroy(RoomType $roomType): object
    {
        return $this->roomTypeRepository->destroy(id: $roomType->id);
    }

}
