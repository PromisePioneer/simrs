<?php

namespace App\Services\Prescription\Repository;

use App\Models\Medicine;
use App\Models\MedicineStockMovement;
use App\Models\Prescription;
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

        $query = $this->model->with(['outpatientVisit.patient', 'medicine', 'pharmacist']);


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
    public function medicationDispensing(string $id): object
    {
        return DB::transaction(function () use ($id) {

            $prescription = $this->model
                ->with('medicine')
                ->findOrFail($id);


            // Cegah double dispense
            if ($prescription->status === 'dispensed') {
                throw new \Exception('Prescription already dispensed');
            }

            $medicine = $prescription->medicine;

            if (!$medicine) {
                throw new \Exception('Medicine not found');
            }

            // Reduce stock
            if ($prescription->quantity > 0) {

                $batch = $this->medicineRepository->getNextBatchFEFO(medicine: $medicine);
                // Optional: cek stock cukup
                if ($batch->stock->stock_amount < (integer)$prescription->quantity) {
                    throw new \Exception('Insufficient stock for medicine: ' . $medicine->name);
                }

                // Kurangi stock

                $beforeStock = $batch->stock->stock_amount;        // stock sebelum dispense
                $stockAfter = $beforeStock - $prescription->quantity; // stock setelah dispense
                $batch->stock->decrement('stock_amount', $prescription->quantity);
                $tenantId = $this->medicineRepository->findByTenantId($medicine->tenant_id)->tenant_id;

                $stockMovement = $this->medicineStockMovementRepository->store(
                    tenantId: $tenantId,
                    medicineId: $medicine->id,
                    batchId: $batch->id,
                    warehouseId: $batch->stock->warehouse_id,
                    rackId: $batch->stock->rack_id,
                    beforeStock: $beforeStock,
                    stockAfter: $stockAfter,
                    prescriptionId: $id,
                    quantity: $prescription->quantity,
                );

            }

            $prescription->status = 'dispensed';
            $prescription->dispensed_by = Auth::id();
            $prescription->dispensed_at = now();
            $prescription->save();

            return $prescription;
        });
    }
}
