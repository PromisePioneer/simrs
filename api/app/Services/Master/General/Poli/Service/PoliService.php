<?php

namespace App\Services\Master\General\Poli\Service;

use App\Http\Requests\PoliRequest;
use App\Models\Poli;
use App\Services\Master\General\Poli\Repository\PoliRepository;
use Illuminate\Http\Request;

class PoliService
{

    protected PoliRepository $poliRepository;

    public function __construct()
    {
        $this->poliRepository = new PoliRepository();
    }


    public function getPoliData(Request $request): ?object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->poliRepository->getPoliData(filters: $filters, perPage: $perPage);
    }


    public function store(PoliRequest $request)
    {
        $data = $request->validated();
        $data['tenant_id'] = auth()->user()->tenant_id ?? null;
        return $this->poliRepository->store(data: $data);
    }


    public function update(PoliRequest $request, Poli $poli): ?object
    {
        $data = $request->validated();
        return $this->poliRepository->update(id: $poli->id, data: $data);
    }


    public function destroy(Poli $poli): bool
    {
        return $this->poliRepository->destroy(id: $poli->id);
    }
}
