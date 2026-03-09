<?php

namespace App\Services\Master\General\MedicalWork\Service;

use App\Http\Requests\SpecializationRequest;
use App\Models\Profession;
use App\Services\Master\General\MedicalWork\Repository\SpecializationRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class SpecializationService
{

    private SpecializationRepository $specializationRepository;

    public function __construct()
    {
        $this->specializationRepository = new SpecializationRepository();
    }

    public function getSpecialization(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->specializationRepository->getSpecializations($filters, $perPage);
    }


    public function getByProfessionId(Request $request, Profession $profession): Collection
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->specializationRepository->getByProfession($profession->id, $filters, $perPage);
    }

    public function store(SpecializationRequest $request): ?Profession
    {
        $data = $request->validated();
        return $this->specializationRepository->store($data);
    }


    public function update(SpecializationRequest $request, string $id): ?Profession
    {
        $data = $request->validated();
        return $this->specializationRepository->update($id, $data);
    }

    public function destroy(Profession $profession): bool
    {
        return $this->specializationRepository->destroy($profession->id);
    }
}
