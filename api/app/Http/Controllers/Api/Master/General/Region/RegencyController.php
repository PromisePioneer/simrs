<?php

namespace App\Http\Controllers\Api\Master\General\Region;

use App\Http\Controllers\Controller;
use App\Models\Regency;
use App\Services\Master\General\Region\Regency\Service\RegencyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegencyController extends Controller
{

    private RegencyService $regencyService;

    public function __construct()
    {
        $this->regencyService = new RegencyService();
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->regencyService->getAllRegencies($request);
        return response()->json($data);
    }


    public function show(Regency $regency): JsonResponse
    {
        $regency->load('provinces');
        return response()->json($regency);
    }
}
