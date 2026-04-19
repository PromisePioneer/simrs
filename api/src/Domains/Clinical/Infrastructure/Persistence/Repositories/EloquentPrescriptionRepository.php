<?php

declare(strict_types=1);

namespace Domains\Clinical\Infrastructure\Persistence\Repositories;

use Domains\Clinical\Domain\Repository\PrescriptionRepositoryInterface;
use Domains\Clinical\Infrastructure\Persistence\Models\PrescriptionModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;
use Exception;

class EloquentPrescriptionRepository extends BaseEloquentRepository implements PrescriptionRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new PrescriptionModel());
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->whereHas('medicine', fn($q) => $q->where('name', 'like', '%' . $filters['search'] . '%'));
        }
        return $query;
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()
            ->with(['medicine', 'outpatientVisit.patient', 'pharmacist'])
            ->orderByDesc('created_at');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Validasi stok dan buat prescriptions untuk satu visit.
     * Stok belum dikurangi — dikurangi saat dispense.
     * @throws Exception
     */
    public function storeForVisit(object $visit, array $prescriptions): void
    {
        foreach ($prescriptions as $item) {
            if (empty($item['medicine_id'])) continue;

            $quantity = (int)($item['quantity'] ?? 0);
            $medicineId = $item['medicine_id'];

            // Validasi total stok
            $totalStock = MedicineBatchModel::where('medicine_id', $medicineId)
                ->whereHas('stock', fn($q) => $q->where('stock_amount', '>', 0))
                ->with('stock')
                ->get()
                ->sum(fn($b) => $b->stock->stock_amount ?? 0);

            if ($totalStock < $quantity) {
                throw new Exception(
                    "Stok obat tidak mencukupi. Tersedia: {$totalStock}, diminta: {$quantity}."
                );
            }

            $visit->prescriptions()->create([
                'tenant_id' => $visit->tenant_id,
                'medicine_id' => $medicineId,
                'dosage' => $item['dosage'],
                'frequency' => $item['frequency'],
                'duration' => $item['duration'] ?? null,
                'route' => $item['route'] ?? null,
                'quantity' => $quantity,
                'notes' => $item['notes'] ?? null,
            ]);
        }
    }

    public function medicationDispensing(string $id, string $status): object
    {
        $prescription = $this->model->newQuery()->findOrFail($id);
        $prescription->update([
            'status' => $status,
            'dispensed_by' => auth()->id(),
            'dispensed_at' => now(),
        ]);
        return $prescription->fresh(['medicine', 'pharmacist']);
    }
}
