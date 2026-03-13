<?php

namespace App\Services\Facilities\Bed\Repository;

use App\Models\Bed;
use App\Services\Facilities\Bed\Interface\BedRepositoryInterface;

class BedRepository implements BedRepositoryInterface
{


    protected Bed $model;

    public function __construct()
    {
        $this->model = new Bed();
    }


    public function getBeds(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model
            ->select('id', 'bed_number', 'room_id', 'status')
            ->with('room:id,name');


        if (!empty($filters['search'])) {
            $query->where('bed_number', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if ($perPage) {
            return $query->paginate(perPage: $perPage);
        }

        // ✅ Tambahkan limit agar tidak return semua data sekaligus
        return $query->limit(50)->get();
    }

    public function findById(string $id): object
    {
        return $this->model->findOrFail(id: $id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(array $data, string $id): object
    {
        $bed = $this->model->findOrFail($id);
        $bed->fill($data);
        $bed->save();

        return $bed->fresh();
    }

    public function destroy(string $id): object
    {
        $bed = $this->findById($id);
        $bed->delete();
        return $bed;
    }


    public function countBasedRoomId(string $roomId): int
    {
        return $this->model->where('room_id', $roomId)->count();
    }
}
