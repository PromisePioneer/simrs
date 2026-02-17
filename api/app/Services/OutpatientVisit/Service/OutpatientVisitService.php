<?php

namespace App\Services\OutpatientVisit\Service;

use App\Http\Requests\OutpatientVisitRequest;
use App\Models\OutpatientVisit;
use App\Services\OutpatientVisit\Repository\OutpatientVisitRepository;
use Illuminate\Http\Request;

class OutpatientVisitService
{
    protected OutpatientVisitRepository $outpatientVisitRepository;

    public function __construct()
    {
        $this->outpatientVisitRepository = new OutpatientVisitRepository();
    }


    public function getOutpatientVisits(Request $request): ?object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->outpatientVisitRepository->getOutpatient(filters: $filters, perPage: $perPage);
    }


    public function store(OutpatientVisitRequest $request): ?object
    {
        $data = $request->validated();
        return $this->outpatientVisitRepository->store(data: $data);
    }


    public function update(OutpatientvisitRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->outpatientVisitRepository->update(data: $data, id: $id);
    }


    public function destroy(OutpatientVisit $outpatientVisit): bool
    {
        return $this->outpatientVisitRepository->destroy(id: $outpatientVisit->id);
    }
}
