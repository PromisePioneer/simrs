<?php

declare(strict_types=1);

namespace Domains\Billing\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Billing\Application\Services\InpatientBillService;
use Domains\Billing\Infrastructure\Persistence\Models\InpatientBillModel;
use Domains\Billing\Presentation\Requests\PayBillRequest;
use Domains\Billing\Presentation\Requests\UpdateBillItemsRequest;
use Domains\Billing\Presentation\Resources\BillResource;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InpatientBillController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly InpatientBillService $service) {}

    /**
     * GET /api/v1/billing/inpatient
     */
    public function index(Request $request): JsonResponse
    {
        $query = InpatientBillModel::with(['patient', 'inpatientAdmission', 'paymentMethod', 'items'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->patient_id, fn($q) => $q->where('patient_id', $request->patient_id))
            ->when($request->date_from, fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->date_to, fn($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->when($request->search, fn($q) => $q->where('bill_number', 'like', "%{$request->search}%"))
            ->orderBy('created_at', 'desc');

        $bills = $query->paginate($request->integer('per_page', 20));

        return response()->json($bills);
    }

    /**
     * GET /api/v1/billing/inpatient/{bill}
     */
    public function show(InpatientBillModel $bill): JsonResponse
    {
        $bill->load(['patient', 'inpatientAdmission.bedAssignments.bed', 'paymentMethod', 'items.medicineBatch.medicine']);
        return response()->json(new BillResource($bill));
    }

    /**
     * POST /api/v1/billing/inpatient/from-admission/{admission}
     */
    public function createFromAdmission(InpatientAdmissionModel $admission): JsonResponse
    {
        $bill = $this->service->createDraftFromAdmission($admission);
        return response()->json(new BillResource($bill->load(['items'])), 201);
    }

    /**
     * PUT /api/v1/billing/inpatient/{bill}/items
     */
    public function updateItems(UpdateBillItemsRequest $request, InpatientBillModel $bill): JsonResponse
    {
        $bill = $this->service->updateItems($bill, $request->validated('items'));
        return response()->json(new BillResource($bill));
    }

    /**
     * POST /api/v1/billing/inpatient/{bill}/pay
     */
    public function pay(PayBillRequest $request, InpatientBillModel $bill): JsonResponse
    {
        if ($bill->status === 'paid') {
            return $this->errorResponse('Tagihan sudah lunas.', 422);
        }

        $bill = $this->service->pay($bill, $request->validated());
        return response()->json(new BillResource($bill));
    }

    /**
     * POST /api/v1/billing/inpatient/{bill}/cancel
     */
    public function cancel(InpatientBillModel $bill): JsonResponse
    {
        if ($bill->status === 'paid') {
            return $this->errorResponse('Tagihan yang sudah lunas tidak bisa dibatalkan.', 422);
        }

        $bill->update(['status' => 'cancelled']);
        return response()->json(new BillResource($bill));
    }
}
