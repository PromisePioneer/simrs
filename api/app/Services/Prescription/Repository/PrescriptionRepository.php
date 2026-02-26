<?php

namespace App\Services\Prescription\Repository;

use App\Models\Prescription;
use App\Services\Prescription\Interface\PrescriptionRepositoryInterface;

class PrescriptionRepository implements PrescriptionRepositoryInterface
{

    protected Prescription $model;

    public function __construct()
    {
        $this->model = new Prescription();
    }

    public function getPrescriptions(array $filters = [], int $perPage = 20): object
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

    public function medicationDispensing()
    {
        // TODO: Implement medicationDispensing() method.
    }
}
