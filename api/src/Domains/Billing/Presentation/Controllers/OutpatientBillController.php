<?php

declare(strict_types=1);

namespace Domains\Billing\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Billing\Application\Services\OutpatientBillService;
use Domains\Billing\Infrastructure\Persistence\Models\OutpatientBillModel;
use Domains\Billing\Presentation\Requests\PayBillRequest;
use Domains\Billing\Presentation\Requests\UpdateBillItemsRequest;
use Domains\Billing\Presentation\Resources\BillResource;
use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutpatientBillController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly OutpatientBillService $service) {}

    /**
     * GET /api/v1/billing/outpatient
     * Daftar tagihan rawat jalan (dengan filter status, patient, tanggal).
     */
    public function index(Request $request): JsonResponse
    {
        $query = OutpatientBillModel::with(['patient', 'outpatientVisit', 'paymentMethod', 'items'])
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
     * GET /api/v1/billing/outpatient/{bill}
     */
    public function show(OutpatientBillModel $bill): JsonResponse
    {
        $bill->load(['patient', 'outpatientVisit.doctor', 'paymentMethod', 'items.medicineBatch.medicine']);
        return response()->json(new BillResource($bill));
    }

    /**
     * POST /api/v1/billing/outpatient/from-visit/{visit}
     * Buat draft tagihan dari kunjungan.
     */
    public function createFromVisit(OutpatientVisitModel $visit): JsonResponse
    {
        $bill = $this->service->createDraftFromVisit($visit);
        return response()->json(new BillResource($bill->load(['items'])), 201);
    }

    /**
     * PUT /api/v1/billing/outpatient/{bill}/items
     * Update line items tagihan.
     */
    public function updateItems(UpdateBillItemsRequest $request, OutpatientBillModel $bill): JsonResponse
    {
        $bill = $this->service->updateItems($bill, $request->validated('items'));
        return response()->json(new BillResource($bill));
    }

    /**
     * POST /api/v1/billing/outpatient/{bill}/pay
     * Proses pembayaran.
     */
    public function pay(PayBillRequest $request, OutpatientBillModel $bill): JsonResponse
    {
        if ($bill->status === 'paid') {
            return $this->errorResponse('Tagihan sudah lunas.', 422);
        }

        $bill = $this->service->pay($bill, $request->validated());
        return response()->json(new BillResource($bill));
    }

    /**
     * POST /api/v1/billing/outpatient/{bill}/cancel
     */
    public function cancel(OutpatientBillModel $bill): JsonResponse
    {
        if ($bill->status === 'paid') {
            return $this->errorResponse('Tagihan yang sudah lunas tidak bisa dibatalkan.', 422);
        }

        $bill->update(['status' => 'cancelled']);
        return response()->json(new BillResource($bill));
    }
}
