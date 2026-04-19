<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\MedicineStockMovementRepositoryInterface;
use Domains\Inpatient\Domain\Enum\InpatientMedicationStatus;
use Domains\Inpatient\Domain\Repository\InpatientDailyMedicationRepositoryInterface;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientDailyMedicationModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

readonly class EloquentInpatientDailyMedicationRepository implements InpatientDailyMedicationRepositoryInterface
{
    public function __construct(
        private InpatientDailyMedicationModel            $model,
        private MedicineStockMovementRepositoryInterface $stockMovementRepository,
    )
    {
    }

    public function getByAdmission(string $admissionId, array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model
            ->with([
                'medicine:id,name,base_unit',
                'prescribedBy:id,name',
                'dispensedBy:id,name',
            ])
            ->where('inpatient_admission_id', $admissionId)
            ->orderByDesc('given_date')
            ->orderByDesc('created_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['given_date'])) {
            $query->whereDate('given_date', $filters['given_date']);
        }

        if (!empty($filters['search'])) {
            $query->whereHas('medicine', fn($q) => $q->where('name', 'like', '%' . $filters['search'] . '%')
            );
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model
            ->with(['medicine', 'prescribedBy', 'dispensedBy', 'inpatientAdmission'])
            ->findOrFail($id);
    }

    /**
     * @throws Exception
     */
    public function store(array $data): object
    {
        // Validasi stok sebelum menyimpan draft
        $medicine = MedicineModel::with('batches.stock')
            ->findOrFail($data['medicine_id']);

        $totalStock = $medicine->batches->sum(fn($b) => $b->stock->stock_amount ?? 0);

        if ($totalStock < (int)$data['quantity']) {
            throw new Exception(
                "Stok tidak mencukupi untuk {$medicine->name}. " .
                "Tersedia: {$totalStock} {$medicine->base_unit}, diminta: {$data['quantity']} {$medicine->base_unit}."
            );
        }

        return $this->model->create($data);
    }

    public function update(array $data, string $id): object
    {
        $record = $this->findById($id);

        if ($record->status !== InpatientMedicationStatus::DRAFT) {
            throw new Exception('Hanya resep berstatus draft yang dapat diubah.');
        }

        $record->fill($data)->save();
        return $record->fresh(['medicine', 'prescribedBy']);
    }

    /** @throws Throwable */
    public function dispense(string $id): object
    {
        return DB::transaction(function () use ($id) {
            $medication = $this->model
                ->with('medicine')
                ->lockForUpdate()
                ->findOrFail($id);

            if ($medication->status !== InpatientMedicationStatus::DRAFT) {
                throw new Exception('Resep ini sudah pernah diproses.');
            }

            $medicine = $medication->medicine;
            if (!$medicine) {
                throw new Exception('Obat tidak ditemukan.');
            }

            $quantity = (int)$medication->quantity;

            // Deduct stock FIFO by nearest expiry
            $batches = MedicineBatchModel::where('medicine_id', $medicine->id)
                ->whereHas('stock', fn($q) => $q->where('stock_amount', '>', 0))
                ->with('stock')
                ->orderBy('expired_date', 'asc')
                ->lockForUpdate()
                ->get();

            $totalStock = $batches->sum(fn($b) => $b->stock->stock_amount ?? 0);

            if ($totalStock < $quantity) {
                throw new Exception(
                    "Stok tidak mencukupi untuk {$medicine->name}. Tersedia: {$totalStock}, diminta: {$quantity}"
                );
            }

            $remaining = $quantity;
            foreach ($batches as $batch) {
                if ($remaining <= 0) break;

                $available = $batch->stock->stock_amount;
                $deduct = min($available, $remaining);
                $afterStock = $available - $deduct;

                $batch->stock->decrement('stock_amount', $deduct);

                $this->stockMovementRepository->store(
                    tenantId: $medicine->tenant_id,
                    medicineId: $medicine->id,
                    batchId: $batch->id,
                    warehouseId: $batch->stock->warehouse_id,
                    rackId: $batch->stock->rack_id,
                    beforeStock: $available,
                    stockAfter: $afterStock,
                    referenceId: $medication->id,
                    quantity: $deduct,
                    referenceType: 'inpatient_medication',
                    notes: "Dispensed for inpatient medication #{$medication->id}",
                );

                $remaining -= $deduct;
            }

            $medication->status = InpatientMedicationStatus::DISPENSED;
            $medication->dispensed_by = Auth::id();
            $medication->dispensed_at = now();
            $medication->save();

            return $medication->fresh(['medicine', 'dispensedBy']);
        });
    }

    public function cancel(string $id): object
    {
        $medication = $this->model->findOrFail($id);

        if ($medication->status === InpatientMedicationStatus::DISPENSED) {
            throw new Exception('Resep yang sudah diberikan tidak dapat dibatalkan.');
        }

        $medication->status = InpatientMedicationStatus::CANCELLED;
        $medication->save();

        return $medication->fresh();
    }

    /**
     * @throws Exception
     */
    public function destroy(string $id): object
    {
        $record = $this->model->findOrFail($id);

        if ($record->status !== InpatientMedicationStatus::DRAFT) {
            throw new Exception('Hanya resep berstatus draft yang dapat dihapus.');
        }

        $record->delete();
        return $record;
    }


}
