<?php

namespace App\Services\Master\General\Region\District\Service;

use App\Services\Master\General\Region\District\Repository\DistrictRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class DistrictService
{
    private DistrictRepository $districtRepository;

    public function __construct()
    {
        $this->districtRepository = new DistrictRepository();
    }


    public function getAllDistricts(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search', 'regency_id']);
        $perPage = $request->query('per_page');
        return $this->districtRepository->getAllDistricts($filters, $perPage);
    }
}
