<?php

declare(strict_types=1);

namespace Domains\Facility\Infrastructure\Persistence\Repositories;

use Domains\Facility\Domain\Repository\RoomRepositoryInterface;
use Domains\Facility\Infrastructure\Persistence\Models\RoomModel;

class EloquentRoomRepository implements RoomRepositoryInterface
{
    public function __construct(private RoomModel $model) {}

    public function getRooms(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->with(['beds', 'ward', 'roomType']);

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('room_number', 'like', '%' . $filters['search'] . '%');
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): object
    {
        $room = $this->findById($id);
        $room->fill($data)->save();
        return $room->fresh();
    }

    public function destroy(string $id): object
    {
        $room = $this->model->findOrFail($id);
        $room->delete();
        return $room;
    }
}
