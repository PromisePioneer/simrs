<?php

declare(strict_types=1);

namespace Domains\Facility\Application\Services;

use Domains\Facility\Domain\Repository\BedRepositoryInterface;
use Domains\Facility\Domain\Repository\RoomRepositoryInterface;
use Domains\Facility\Infrastructure\Persistence\Models\RoomModel;
use Domains\IAM\Infrastructure\Persistence\Models\RoomTypeModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

readonly class RoomService
{
    public function __construct(
        private RoomRepositoryInterface $roomRepository,
        private BedRepositoryInterface  $bedRepository,
        private BedService              $bedService,
    )
    {
    }


    public function getRooms(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->roomRepository->getRooms(
            filters: $filters,
            perPage: $perPage ? (int)$perPage : null
        );
    }

    /**
     * @throws Throwable
     */
    public function store(array $data): object
    {
        return DB::transaction(function () use ($data) {
            $capacity = RoomTypeModel::find($data['room_type_id'])->first()?->capacity ?? $data['capacity'];
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

    public function update(array $data, RoomModel $room): object
    {
        return $this->roomRepository->update(id: $room->id, data: $data);
    }

    public function destroy(RoomModel $room): object
    {
        return $this->roomRepository->destroy(id: $room->id);
    }
}
