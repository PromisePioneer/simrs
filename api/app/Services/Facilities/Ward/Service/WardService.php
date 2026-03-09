<?php

namespace App\Services\Facilities\Ward\Service;

use App\Http\Requests\WardRequest;
use App\Models\Ward;
use App\Services\Facilities\Ward\Repository\WardRepository;
use Illuminate\Http\Request;

class WardService
{
    protected WardRepository $wardRepository;


    public function __construct()
    {
        $this->wardRepository = new WardRepository();
    }


    public function getWards(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->wardRepository->getWards(filters: $filters, perPage: $perPage);
    }


    public function store(WardRequest $request): object
    {
        $data = $request->validated();
        return $this->wardRepository->store(data: $data);
    }


    public function update(WardRequest $request, Ward $ward): object
    {
        $data = $request->validated();
        return $this->wardRepository->update(data: $data, id: $ward->id);
    }


    public function destroy(Ward $ward): bool
    {
        return $this->wardRepository->destroy(id: $ward->id);
    }
}
