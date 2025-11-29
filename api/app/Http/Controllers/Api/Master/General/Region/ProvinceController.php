<?php

namespace App\Http\Controllers\Api\Master\General\Region;

use App\Http\Controllers\Controller;
use App\Services\Master\General\Region\Province\Service\ProvinceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    private ProvinceService $provinceService;

    public function __construct()
    {
        $this->provinceService = new ProvinceService();
    }

    public function index(Request $request): JsonResponse
    {
        $provinces = $this->provinceService->getProvinces($request);
        return response()->json($provinces);
    }
}
