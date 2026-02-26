<?php

namespace App\Services\Prescription\Repository;

use App\Models\Prescription;
use App\Services\Prescription\Interface\PrescriptionRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

class PrescriptionRepository implements PrescriptionRepositoryInterface
{

    protected Prescription $model;

    public function __construct()
    {
        $this->model = new Prescription();
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

            // Reduce stock
            if ($prescription->medicine && $prescription->quantity) {
                $prescription->medicine->decrement(
                    'stock',
                    $prescription->quantity
                );
            }

            // Update prescription
            $prescription->update([
                'status' => 'dispensed',
                'dispensed_by' => Auth::id(),
                'dispensed_at' => now(),
            ]);

            return $prescription;
        });
    }
}
