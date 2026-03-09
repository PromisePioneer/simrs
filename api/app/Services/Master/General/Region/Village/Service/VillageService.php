<?php

namespace App\Services\Master\General\Region\Village\Service;

use App\Services\Master\General\Region\Village\Repository\VillageRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class VillageService
{

    private VillageRepository $villageRepository;

    public function __construct()
    {
        $this->villageRepository = new VillageRepository();
    }

    public function getAllVillages(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search', 'district_id']);
        $perPage = $request->input('perPage');
        return $this->villageRepository->getAllVillages($filters, $perPage);
    }
}
