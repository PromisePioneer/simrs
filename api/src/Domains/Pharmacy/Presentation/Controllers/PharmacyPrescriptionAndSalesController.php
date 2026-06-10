<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Domains\Pharmacy\Application\Services\PharmacyPrescriptionAndSalesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyPrescriptionAndSalesController extends Controller
{
    public function __construct(
        private PharmacyPrescriptionAndSalesService $prescriptionService,
    ) {}

    /**
     * Create E-Prescription (from Doctor)
     */
    public function createPrescription(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'patient_id' => 'required|integer|exists:patients,id',
                'poli_id' => 'nullable|integer|exists:masterdata_polis,id',
                'clinic_visit_id' => 'nullable|integer|exists:outpatient_clinic_visits,id',
                'inpatient_admission_id' => 'nullable|integer|exists:inpatient_admissions,id',
                'prescription_type' => 'required|in:outpatient,inpatient,emergency',
                'clinical_notes' => 'nullable|string',
                'special_instructions' => 'nullable|string',
                'refill_count' => 'nullable|integer|min:0',
                'items' => 'required|array|min:1',
                'items.*.medicine_id' => 'required|integer|exists:pharmacy_medicines,id',
                'items.*.unit_id' => 'required|integer|exists:pharmacy_units,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.dosage' => 'nullable|string',
                'items.*.frequency' => 'nullable|string',
                'items.*.route' => 'nullable|in:oral,IV,IM,topical,other',
                'items.*.usage_instruction' => 'nullable|string',
                'items.*.meal_relation' => 'nullable|in:before_meal,after_meal,with_meal,no_relation',
                'items.*.duration_days' => 'nullable|integer|min:1',
            ]);

            $tenantId = auth()->user()->current_tenant_id;
            $validated['doctor_id'] = auth()->id();

            $prescription = $this->prescriptionService->createPrescription($tenantId, $validated);

            return response()->json([
                'success' => true,
                'message' => 'E-Resep berhasil dibuat',
                'data' => $prescription->load('items'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Review Prescription (Telaah Resep)
     */
    public function reviewPrescription(int $prescriptionId, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'review_type' => 'required|in:administrative,pharmaceutical,clinical',
                'review_notes' => 'nullable|string',
                'recommendations' => 'nullable|string',
            ]);

            $review = $this->prescriptionService->reviewPrescription(
                $prescriptionId,
                auth()->id(),
                $validated
            );

            return response()->json([
                'success' => true,
                'message' => 'Telaah Resep berhasil dilakukan',
                'data' => $review,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Approve Prescription for Dispensing
     */
    public function approvePrescription(int $prescriptionId): JsonResponse
    {
        try {
            $this->authorize('dispense', 'pharmacy.prescription');

            $this->prescriptionService->approvePrescriptionForDispensing($prescriptionId, auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'Resep disetujui untuk dispensing',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Create Sales from Prescription
     */
    public function createSaleFromPrescription(int $prescriptionId, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'warehouse_id' => 'required|integer|exists:pharmacy_warehouses,id',
                'payment_status' => 'nullable|in:pending,paid,partial,credit',
                'notes' => 'nullable|string',
            ]);

            $tenantId = auth()->user()->current_tenant_id;

            $sale = $this->prescriptionService->createSaleFromPrescription(
                $tenantId,
                $prescriptionId,
                $validated['warehouse_id'],
                auth()->id(),
                $validated
            );

            return response()->json([
                'success' => true,
                'message' => 'Penjualan dari resep berhasil dibuat',
                'data' => $sale->load('items'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Complete Sale
     */
    public function completeSale(int $saleId): JsonResponse
    {
        try {
            $this->prescriptionService->completeSale($saleId);

            return response()->json([
                'success' => true,
                'message' => 'Penjualan berhasil diselesaikan',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Create Patient Return
     */
    public function createPatientReturn(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'sales_id' => 'required|integer|exists:pharmacy_sales,id',
                'patient_id' => 'required|integer|exists:patients,id',
                'reason' => 'required|in:not_used,wrong_medicine,side_effect,expired_received,damaged,other',
                'reason_description' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.medicine_batch_id' => 'required|integer|exists:pharmacy_medicine_batches,id',
                'items.*.quantity' => 'required|integer|min:1',
            ]);

            $tenantId = auth()->user()->current_tenant_id;
            $validated['processed_by'] = auth()->id();

            $this->prescriptionService->createPatientReturn($tenantId, $validated['sales_id'], $validated);

            return response()->json([
                'success' => true,
                'message' => 'Retur pasien berhasil dibuat',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get Prescriptions List
     */
    public function getPrescriptions(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'nullable|in:pending,dispensed,partially_dispensed,cancelled,expired',
                'patient_id' => 'nullable|integer|exists:patients,id',
                'type' => 'nullable|in:outpatient,inpatient,emergency',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date',
                'per_page' => 'nullable|integer|min:1|max:100',
            ]);

            $query = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPrescription::where('tenant_id', auth()->user()->current_tenant_id);

            if (isset($validated['status'])) {
                $query->where('status', $validated['status']);
            }

            if (isset($validated['patient_id'])) {
                $query->where('patient_id', $validated['patient_id']);
            }

            if (isset($validated['type'])) {
                $query->where('prescription_type', $validated['type']);
            }

            if (isset($validated['date_from'])) {
                $query->whereDate('prescription_date', '>=', $validated['date_from']);
            }

            if (isset($validated['date_to'])) {
                $query->whereDate('prescription_date', '<=', $validated['date_to']);
            }

            $prescriptions = $query->with(['items', 'patient', 'doctor'])
                ->orderBy('prescription_date', 'desc')
                ->paginate($validated['per_page'] ?? 15);

            return response()->json([
                'success' => true,
                'data' => $prescriptions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get Sales List
     */
    public function getSales(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'nullable|in:draft,completed,cancelled,returned',
                'type' => 'nullable|in:inpatient,outpatient,emergency,otc',
                'payment_status' => 'nullable|in:pending,paid,partial,credit',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date',
                'per_page' => 'nullable|integer|min:1|max:100',
            ]);

            $query = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySale::where('tenant_id', auth()->user()->current_tenant_id);

            if (isset($validated['status'])) {
                $query->where('status', $validated['status']);
            }

            if (isset($validated['type'])) {
                $query->where('sales_type', $validated['type']);
            }

            if (isset($validated['payment_status'])) {
                $query->where('payment_status', $validated['payment_status']);
            }

            if (isset($validated['date_from'])) {
                $query->whereDate('sales_date', '>=', $validated['date_from']);
            }

            if (isset($validated['date_to'])) {
                $query->whereDate('sales_date', '<=', $validated['date_to']);
            }

            $sales = $query->with(['items', 'patient', 'pharmacist'])
                ->orderBy('sales_date', 'desc')
                ->paginate($validated['per_page'] ?? 15);

            return response()->json([
                'success' => true,
                'data' => $sales,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get Sale Details
     */
    public function getSaleDetails(int $saleId): JsonResponse
    {
        try {
            $sale = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySale::with([
                'items.medicineBatch.medicine',
                'items.unit',
                'patient',
                'pharmacist',
                'prescription.items'
            ])->find($saleId);

            if (!$sale) {
                return response()->json([
                    'success' => false,
                    'message' => 'Penjualan tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $sale,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Print Etiket (Print Label)
     */
    public function printEtiket(int $prescriptionItemId): JsonResponse
    {
        try {
            $item = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPrescriptionItem::with([
                'medicine',
                'prescription.patient',
                'prescription.doctor'
            ])->find($prescriptionItemId);

            if (!$item) {
                return response()->json([
                    'success' => false,
                    'message' => 'Item resep tidak ditemukan',
                ], 404);
            }

            // Generate etiket data
            $etiket = [
                'medicine_name' => $item->medicine->name,
                'strength' => $item->medicine->strength ?? '',
                'dosage' => $item->dosage ?? '',
                'frequency' => $item->frequency ?? '',
                'route' => $item->route ?? '',
                'usage_instruction' => $item->usage_instruction ?? '',
                'patient_name' => $item->prescription->patient->name ?? '',
                'doctor_name' => $item->prescription->doctor->name ?? '',
                'date' => now()->format('d/m/Y H:i'),
                'is_high_alert' => $item->is_high_alert,
                'lasa_warning' => $item->lasa_warning ?? null,
            ];

            return response()->json([
                'success' => true,
                'data' => $etiket,
                'message' => 'Data etiket siap cetak',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
