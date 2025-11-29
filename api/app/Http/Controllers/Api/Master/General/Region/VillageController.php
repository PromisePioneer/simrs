<?php

namespace App\Http\Controllers\Api\Master\General\Region;

use App\Http\Controllers\Controller;
use App\Services\Master\General\Region\Village\Service\VillageService;
use Illuminate\Http\Request;

class VillageController extends Controller
{
    private VillageService $villageService;

    public function __construct()
    {
        $this->villageService = new VillageService();
    }

    public function index(Request $request)
    {
        $villages = $this->villageService->getAllVillages($request);
        return response()->json($villages);
    }
}
