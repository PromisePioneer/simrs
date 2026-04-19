<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Domains\Pharmacy\Application\Services\MedicineStockMovementService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineStockMovementModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineStockMovementController extends Controller
{
    public function __construct(
        private readonly MedicineStockMovementService $stockMovementService,
    )
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', MedicineStockMovementModel::class);

        $data = $this->stockMovementService->getStockMovements($request);

        return response()->json($data);
    }
}
