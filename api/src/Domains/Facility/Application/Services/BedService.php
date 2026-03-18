<?php

declare(strict_types=1);

namespace Domains\Facility\Application\Services;

use Domains\Facility\Domain\Repository\BedRepositoryInterface;
use Domains\Facility\Domain\Repository\RoomRepositoryInterface;
use Domains\Facility\Infrastructure\Persistence\Models\BedModel;
use Illuminate\Http\Request;

class BedService
{
    public function __construct(
        private BedRepositoryInterface  $bedRepository,
        private RoomRepositoryInterface $roomRepository,
    ) {}

    public function getBeds(Request $request): object
    {
        $filters = $request->only(['search', 'status']);
        $perPage = $request->input('perPage');
        return $this->bedRepository->getBeds(filters: $filters, perPage: $perPage);
    }

    public function store(array $data): object
    {
        return $this->bedRepository->store(data: $data);
    }

    public function update(array $data, BedModel $bed): object
    {
        return $this->bedRepository->update(data: $data, id: $bed->id);
    }

    public function destroy(BedModel $bed): object
    {
        return $this->bedRepository->destroy(id: $bed->id);
    }

    public function generateBedNumber(string $roomId): string
    {
        $room  = $this->roomRepository->findById($roomId);
        $count = $this->bedRepository->countBasedRoomId($roomId);
        $letter = chr(65 + $count);
        return $room->room_number . '-' . $letter;
    }
}
