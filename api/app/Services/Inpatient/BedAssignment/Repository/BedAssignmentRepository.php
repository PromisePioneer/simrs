<?php

namespace App\Services\Inpatient\BedAssignment\Repository;

use App\Models\BedAssignment;
use App\Services\Inpatient\BedAssignment\Interface\BedAssignmentInterface;

class BedAssignmentRepository implements BedAssignmentInterface
{


    protected BedAssignment $model;

    public function __construct()
    {
        $this->model = new BedAssignment();
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }
}
