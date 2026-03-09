<?php

namespace App\Services\Master\General\Region\Province\Service;

use App\Services\Master\General\Region\Province\Repository\ProvinceRepository;
use Illuminate\Http\Request;

class ProvinceService
{
    private ProvinceRepository $provinceRepository;

    public function __construct()
    {
        $this->provinceRepository = new ProvinceRepository();
    }

    public function getProvinces(Request $request): ?object
    {
        $filters = $request->only('search');
        $perPage = $request->input('perPage');
        return $this->provinceRepository->getProvinces($filters, $perPage);
    }
}
