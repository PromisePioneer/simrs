<?php

namespace App\Services\Master\General\Degree\Service;

use App\Http\Requests\DegreeRequest;
use App\Models\Degree;
use App\Services\Master\General\Degree\Repository\DegreeRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class DegreeService
{

    private DegreeRepository $degreeRepository;

    public function __construct()
    {
        $this->degreeRepository = new DegreeRepository();
    }

    public function getDegrees(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['type', 'search']);
        $perPage = $request->input('per_page');
        return $this->degreeRepository->getDegrees($filters, $perPage);
    }


    public function store(DegreeRequest $request): object
    {
        $data = $request->validated();
        return $this->degreeRepository->store($data);
    }

    public function update(DegreeRequest $request, Degree $degree): object
    {
        $data = $request->validated();
        return $this->degreeRepository->update($data, $degree->id);
    }


    public function destroy(Degree $degree): object
    {
        return $this->degreeRepository->destroy($degree->id);
    }
}
