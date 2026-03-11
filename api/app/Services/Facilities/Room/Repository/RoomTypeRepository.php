<?php

namespace App\Services\Facilities\Room\Repository;

use App\Models\RoomType;
use App\Services\Facilities\Room\Interface\RoomTypeRepositoryInterface;

class RoomTypeRepository implements RoomTypeRepositoryInterface
{


    protected RoomType $model;

    public function __construct()
    {
        $this->model = new RoomType();
    }

    public function getRoomTypes(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->query();


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

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): object
    {
        $roomType = $this->findById($id);
        $roomType->fill($data);
        $roomType->save();

        return $roomType->fresh();
    }

    public function destroy(string $id): object
    {
        $roomType = $this->findById($id);
        $roomType->delete();
        return $roomType;
    }
}
