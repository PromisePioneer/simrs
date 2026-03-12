<?php

namespace App\Services\Facilities\Room\Repository;

use App\Models\Bed;
use App\Models\Room;
use App\Services\Facilities\Bed\Service\BedService;
use App\Services\Facilities\Room\Interface\RoomRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Throwable;

class RoomRepository implements RoomRepositoryInterface
{

    protected Room $model;
    protected Bed $bedModel;
    protected BedService $bedService;

    public function __construct()
    {
        $this->model = new Room();
        $this->bedModel = new Bed();
    }

    public function getRooms(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->with('ward');
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('code', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->findOrFail($id);
    }

    /**
     * @throws Throwable
     */
    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data = []): object
    {
        $room = $this->findById($id);
        $room->fill($data);
        $room->save();

        return $room->fresh();
    }

    public function destroy(string $id): object
    {
        $room = $this->model->findOrFail($id);
        $room->delete();
        return $room;
    }
}
