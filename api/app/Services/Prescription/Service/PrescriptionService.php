<?php

namespace App\Services\Prescription\Service;

use App\Models\Prescription;
use App\Services\Prescription\Repository\PrescriptionRepository;
use Illuminate\Http\Request;

class PrescriptionService
{

    protected PrescriptionRepository $prescriptionRepository;

    public function __construct()
    {
        $this->prescriptionRepository = new PrescriptionRepository();
    }


    public function getPrescriptions(Request $request): ?object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->prescriptionRepository->getPrescriptions(filters: $filters, perPage: $perPage);
    }


    /**
     * @throws \Throwable
     */
    public function medicationDispensing(Prescription $prescription): ?object
    {
        return $this->prescriptionRepository->medicationDispensing($prescription->id);
    }

}
