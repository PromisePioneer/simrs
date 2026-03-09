<?php

namespace App\Services\Master\General\Region\Regency\Service;

use App\Services\Master\General\Region\Regency\Repository\RegencyRepository;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class RegencyService
{
    private RegencyRepository $regencyRepository;

    public function __construct()
    {
        $this->regencyRepository = new RegencyRepository();
    }

    public function getAllRegencies(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search', 'province_id']);
        $perPage = $request->input('per_page');
        return $this->regencyRepository->getAllRegencies($filters, $perPage);
    }
}
