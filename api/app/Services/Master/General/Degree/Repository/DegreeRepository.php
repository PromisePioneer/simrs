<?php

namespace App\Services\Master\General\Degree\Repository;

use App\Models\Degree;
use App\Services\Master\General\Degree\Interface\DegreeRepositoryInterface;
use Illuminate\Support\Facades\DB;

class DegreeRepository implements DegreeRepositoryInterface
{
    private Degree $degree;

    public function __construct()
    {
        $this->degree = new Degree();
    }

    public function getDegrees(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->degree->orderBy('name');
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['search'])) {
            $query->where(DB::raw('LOWER(name)'), 'like', '%' . strtolower($filters['search']) . '%')
                ->orWhere(DB::raw('LOWER(type)'), 'like', '%' . strtolower($filters['search']) . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): object
    {
        return $this->degree->findOrFail($id);
    }

    public function store(array $data = []): object
    {
        return $this->degree->create($data);
    }

    public function update(string $id, array $data = []): object
    {
        $degree = $this->degree->findOrFail($id);
        $degree->fill($data);
        $degree->save();
        return $degree->fresh();
    }

    public function destroy(string $id): object
    {
        $degree = $this->degree->findOrFail($id);
        $degree->delete();
        return $degree;
    }
}
