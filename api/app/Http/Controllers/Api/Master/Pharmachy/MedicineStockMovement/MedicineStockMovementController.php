<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineStockMovement;

use App\Http\Controllers\Controller;
use App\Models\MedicineStockMovement;
use App\Services\MedicineStockMovement\Service\MedicineStockMovementService;
use Illuminate\Http\JsonResponse;

class MedicineStockMovementController extends Controller
{

    protected MedicineStockMovementService $medicineStockMovementService;

    public function __construct()
    {
        $this->medicineStockMovementService = new MedicineStockMovementService();
    }


    public function index(): JsonResponse
    {
        $this->authorize('view', MedicineStockMovement::class);
        $data = $this->medicineStockMovementService->getStockMovements();
        return response()->json($data);
    }
}
