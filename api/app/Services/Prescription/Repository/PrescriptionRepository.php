<?php

namespace App\Services\Prescription\Repository;

use App\Enum\Queue\QueueStatus;
use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\MedicineStockMovement;
use App\Models\Prescription;
use App\Models\Queue;
use App\Services\Master\Pharmachy\Medicine\Repository\MedicineRepository;
use App\Services\MedicineStockMovement\Repository\MedicineStockMovementRepository;
use App\Services\Prescription\Interface\PrescriptionRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

class PrescriptionRepository implements PrescriptionRepositoryInterface
{

    protected Prescription $model;
    protected MedicineRepository $medicineRepository;

    protected MedicineStockMovementRepository $medicineStockMovementRepository;

    public function __construct()
    {
        $this->model = new Prescription();
        $this->medicineRepository = new MedicineRepository();
        $this->medicineStockMovementRepository = new MedicineStockMovementRepository();
    }

    public function getPrescriptions(array $filters = [], ?int $perPage = null): object
    {

        $query = $this->model->with(['outpatientVisit.patient', 'outpatientVisit.doctor', 'medicine', 'pharmacist', 'tenant']);


        if (!empty($filters['search'])) {
            $query->whereHas('pharmacist', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            })->orWhereHas('outpatientVisit.patient', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            });
        }


        if ($perPage) {
            return $query->paginate(perPage: $perPage);
        }


        return $query->get();
    }

    /**
     * @throws Throwable
     */
    public function medicationDispensing(string $id, string $status): object
    {
        return DB::transaction(function () use ($status, $id) {

            $prescription = $this->model
                ->with('medicine')
                ->lockForUpdate()
                ->findOrFail($id);

            if ($prescription->status === 'dispensed') {
                throw new \Exception('Resep ini sudah pernah dikeluarkan');
            }

            $medicine = $prescription->medicine;
            if (!$medicine) {
                throw new \Exception('Obat tidak ditemukan');
            }

            $quantity = (int)$prescription->quantity;

            if ($quantity > 0 && $status !== "cancelled") {
                $batches = MedicineBatch::where('medicine_id', $medicine->id)
                    ->whereHas('stock', fn($q) => $q->where('stock_amount', '>', 0))
                    ->with('stock')
                    ->orderBy('expired_date', 'asc')
                    ->lockForUpdate()
                    ->get();

                $totalStock = $batches->sum(fn($b) => $b->stock->stock_amount ?? 0);

                if ($totalStock < $quantity) {
                    throw new \Exception(
                        "Stok tidak mencukupi untuk {$medicine->name}. Tersedia: {$totalStock}, diminta: {$quantity}"
                    );
                }

                $tenantId = $medicine->tenant_id;
                $remaining = $quantity;

                foreach ($batches as $batch) {
                    if ($remaining <= 0) break;

                    $available = $batch->stock->stock_amount;
                    $deduct = min($available, $remaining);
                    $beforeStock = $available;
                    $stockAfter = $available - $deduct;

                    $batch->stock->decrement('stock_amount', $deduct);

                    $this->medicineStockMovementRepository->store(
                        tenantId: $tenantId,
                        medicineId: $medicine->id,
                        batchId: $batch->id,
                        warehouseId: $batch->stock->warehouse_id,
                        rackId: $batch->stock->rack_id,
                        beforeStock: $beforeStock,
                        stockAfter: $stockAfter,
                        prescriptionId: $id,
                        quantity: $deduct,   // ← jumlah yang diambil dari batch ini
                    );

                    $remaining -= $deduct;
                }
            }

            $prescription->status = $status;
            $prescription->dispensed_by = Auth::id();
            $prescription->dispensed_at = now();
            $prescription->save();

            return $prescription->fresh('medicine');
        });
    }
}
