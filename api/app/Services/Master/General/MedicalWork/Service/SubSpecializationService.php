<?php

namespace App\Services\Master\General\MedicalWork\Service;

use App\Http\Requests\ProfessionRequest;
use App\Http\Requests\SubSpecializationRequest;
use App\Models\Profession;
use App\Models\Specialization;
use App\Services\Master\General\MedicalWork\Repository\SubSpecializationRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class SubSpecializationService
{
    private SubSpecializationRepository $subSpecializationRepository;

    public function __construct()
    {
        $this->subSpecializationRepository = new SubSpecializationRepository();
    }

    public function getSubSpecializations(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->subSpecializationRepository->getSubSpecializations($filters, $perPage);
    }


    public function getBySpecializations(Request $request, Specialization $specialization): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->subSpecializationRepository->getBySpecializations($specialization->id, $filters, $perPage);
    }

    public function store(SubSpecializationRequest $request): ?Profession
    {
        $data = $request->validated();
        return $this->subSpecializationRepository->store($data);
    }


    public function update(SubSpecializationRequest $request, string $id): ?Profession
    {
        $data = $request->validated();
        return $this->subSpecializationRepository->update($id, $data);
    }

    public function destroy(Profession $profession): bool
    {
        return $this->subSpecializationRepository->destroy($profession->id);
    }
}
