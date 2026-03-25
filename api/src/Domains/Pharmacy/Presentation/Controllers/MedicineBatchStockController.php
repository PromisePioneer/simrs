<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Pharmacy\Application\Services\MedicineBatchStockService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchStockModel;
use Domains\Pharmacy\Presentation\Requests\MedicineBatchStockRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineBatchStockController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly MedicineBatchStockService $batchStockService
    )
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', MedicineBatchStockModel::class);
        $data = $this->batchStockService->getBatchStocks(request: $request);
        return response()->json($data);
    }

    public function show(MedicineBatchStockModel $medicineBatchStock): JsonResponse
    {
        $this->authorize('view', $medicineBatchStock);
        $medicineBatchStock->load(['batch', 'batch.medicine', 'warehouse', 'rack']);
        return response()->json($medicineBatchStock);
    }

    public function store(MedicineBatchStockRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineBatchStockModel::class);
        $data = $this->batchStockService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Stok batch obat berhasil ditambahkan.', status: 201);
    }
}
