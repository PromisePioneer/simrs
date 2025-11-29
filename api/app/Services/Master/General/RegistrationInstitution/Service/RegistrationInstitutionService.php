<?php

namespace App\Services\Master\General\RegistrationInstitution\Service;

use App\Http\Requests\RegistrationInstitutionRequest;
use App\Services\Master\General\RegistrationInstitution\Repository\RegistrationInstitutionRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class RegistrationInstitutionService
{

    private RegistrationInstitutionRepository $registrationInstitutionRepository;

    public function __construct()
    {
        $this->registrationInstitutionRepository = new RegistrationInstitutionRepository();
    }


    public function getAllInstitutes(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['type', 'search']);
        $perPage = $request->input('per_page');
        return $this->registrationInstitutionRepository->getAllRegistrationInstitutes($filters, $perPage);
    }


    public function store(RegistrationInstitutionRequest $request)
    {
        $data = $request->validated();
        return $this->registrationInstitutionRepository->store($data);
    }

    public function update(RegistrationInstitutionRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->registrationInstitutionRepository->update($id, $data);
    }


    public function destroy(string $id): ?object
    {
        return $this->registrationInstitutionRepository->destroy($id);
    }


}
