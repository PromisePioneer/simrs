<?php

namespace App\Services\Master\General\Patient\Repository;

use App\Models\PatientAddress;

class PatientAddressRepository
{

    public function __construct()
    {
        $this->model = new PatientAddress();
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }


    public function update(string $id, array $data)
    {
        //
    }
}
