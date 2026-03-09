<?php

namespace App\Services\MedicineStockMovement\Service;

use App\Services\MedicineStockMovement\Repository\MedicineStockMovementRepository;

class MedicineStockMovementService
{

    protected MedicineStockMovementRepository $medicineStockMovementRepository;

    public function __construct()
    {
        $this->medicineStockMovementRepository = new MedicineStockMovementRepository();
    }


    public function getStockMovements(): object
    {
        return $this->medicineStockMovementRepository->getStockMovements();
    }
}
