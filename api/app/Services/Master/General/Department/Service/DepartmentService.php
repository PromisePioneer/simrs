<?php

namespace App\Services\Master\General\Department\Service;

use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use App\Services\Master\General\Department\Repository\DepartmentRepository;
use Illuminate\Http\Request;

class DepartmentService
{
    protected DepartmentRepository $departmentRepository;

    public function __construct()
    {
        $this->departmentRepository = new DepartmentRepository();
    }

    public function getDepartments(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');

        return $this->departmentRepository->getDepartments(filters: $filters, perPage: $perPage);
    }


    public function store(DepartmentRequest $request): object
    {
        $data = $request->validated();
        return $this->departmentRepository->store(data: $data);
    }


    public function update(DepartmentRequest $request, Department $department): object
    {
        $data = $request->validated();
        return $this->departmentRepository->update(id: $department->id, data: $data);
    }


    public function destroy(Department $department): object
    {
        return $this->departmentRepository->destroy(id: $department->id);
    }
}
