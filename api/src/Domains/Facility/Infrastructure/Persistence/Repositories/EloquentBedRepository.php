<?php

declare(strict_types=1);

namespace Domains\Facility\Infrastructure\Persistence\Repositories;

use Domains\Facility\Domain\Repository\BedRepositoryInterface;
use Domains\Facility\Infrastructure\Persistence\Models\BedModel;

class EloquentBedRepository implements BedRepositoryInterface
{
    public function __construct(private BedModel $model) {}

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
            return $query->paginate($perPage);
        }

        return $query->limit(50)->get();
    }

    public function findById(string $id): object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(array $data, string $id): object
    {
        $bed = $this->model->findOrFail($id);
        $bed->fill($data)->save();
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
