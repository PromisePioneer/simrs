<?php

namespace App\Http\Controllers\Api\Master\General\Region;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Services\Master\General\Region\District\Service\DistrictService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DistrictController extends Controller
{

    private DistrictService $districtService;

    public function __construct()
    {
        $this->districtService = new DistrictService();
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->districtService->getAllDistricts($request);
        return response()->json($data);
    }


    public function show(District $district): JsonResponse
    {
        return response()->json($district);
    }
}
