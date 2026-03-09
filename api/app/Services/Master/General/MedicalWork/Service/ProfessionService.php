<?php

namespace App\Services\Master\General\MedicalWork\Service;

use App\Http\Requests\ProfessionRequest;
use App\Models\Profession;
use App\Services\Master\General\MedicalWork\Repository\ProfessionRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ProfessionService
{

    private ProfessionRepository $professionRepository;

    public function __construct()
    {
        $this->professionRepository = new ProfessionRepository();
    }

    public function getProfessions(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->professionRepository->getProfessions($filters, $perPage);
    }

    public function store(ProfessionRequest $request): ?Profession
    {
        $data = $request->validated();
        return $this->professionRepository->store($data);
    }


    public function update(ProfessionRequest $request, string $id): ?Profession
    {
        $data = $request->validated();
        return $this->professionRepository->update($id, $data);
    }

    public function destroy(Profession $profession): bool
    {
        return $this->professionRepository->destroy($profession->id);
    }
}
