<?php

declare(strict_types=1);

namespace Domains\Clinical\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Clinical\Application\Services\PrescriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly PrescriptionService $service) {}

    public function index(Request $request): JsonResponse
    {
        $result = $this->service->getAll($request);
        return response()->json($result);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json($this->service->findById($id));
    }

    /** POST /prescriptions/medication-dispensing/{id} */
    public function medicationDispensing(string $id, Request $request): JsonResponse
    {
        $result = $this->service->dispense($id, $request);
        return $this->successResponse($result, 'Obat berhasil didispensing.');
    }
}
