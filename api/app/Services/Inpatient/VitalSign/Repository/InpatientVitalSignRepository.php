<?php

namespace App\Services\Inpatient\VitalSign\Repository;

use App\Models\InpatientVitalSign;
use App\Services\Inpatient\VitalSign\Interface\InpatientVitalSignInterface;

class InpatientVitalSignRepository implements InpatientVitalSignInterface
{


    protected InpatientVitalSign $model;

    public function __construct()
    {
        $this->model = new InpatientVitalSign();
    }


    public function store(array $data): object
    {
        return $this->model->create($data);
    }
}
